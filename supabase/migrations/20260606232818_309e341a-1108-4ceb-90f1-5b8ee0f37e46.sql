
-- Threshold config
CREATE TABLE public.security_alert_config (
  id boolean PRIMARY KEY DEFAULT true CHECK (id = true),
  abnormal_activity_notify boolean NOT NULL DEFAULT true,
  storage_denied_threshold_per_hour integer NOT NULL DEFAULT 5,
  notification_dedup_minutes integer NOT NULL DEFAULT 60,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid
);

GRANT SELECT ON public.security_alert_config TO authenticated;
GRANT ALL ON public.security_alert_config TO service_role;

ALTER TABLE public.security_alert_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view security alert config"
  ON public.security_alert_config FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update security alert config"
  ON public.security_alert_config FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert security alert config"
  ON public.security_alert_config FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

INSERT INTO public.security_alert_config (id) VALUES (true) ON CONFLICT DO NOTHING;

-- Trigger function: fan-out notifications to all admins
CREATE OR REPLACE FUNCTION public.notify_admins_on_security_event()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cfg public.security_alert_config%ROWTYPE;
  denial_count integer;
  recent_dup integer;
  notif_title text;
  notif_message text;
  actor_name text;
BEGIN
  SELECT * INTO cfg FROM public.security_alert_config WHERE id = true;
  IF NOT FOUND THEN RETURN NEW; END IF;

  IF NEW.action NOT IN ('abnormal.activity', 'storage.denied') THEN
    RETURN NEW;
  END IF;

  -- Resolve actor display name (best effort)
  SELECT COALESCE(NULLIF(TRIM(COALESCE(first_name,'') || ' ' || COALESCE(last_name,'')), ''), email, 'Unknown user')
    INTO actor_name
  FROM public.users WHERE id = NEW.user_id;
  actor_name := COALESCE(actor_name, 'Unknown user');

  IF NEW.action = 'abnormal.activity' THEN
    IF NOT cfg.abnormal_activity_notify THEN RETURN NEW; END IF;
    notif_title := 'Abnormal activity detected';
    notif_message := actor_name || ' triggered an abnormal activity alert (' ||
                     COALESCE(NEW.metadata->>'reason', 'unspecified') || ').';
  ELSE
    -- storage.denied: count this user's denials in the last hour
    SELECT count(*) INTO denial_count
    FROM public.audit_logs
    WHERE user_id = NEW.user_id
      AND action = 'storage.denied'
      AND created_at > now() - interval '1 hour';

    IF denial_count < cfg.storage_denied_threshold_per_hour THEN
      RETURN NEW;
    END IF;

    notif_title := 'Repeated access denials';
    notif_message := actor_name || ' has ' || denial_count ||
                     ' storage access denials in the last hour.';
  END IF;

  -- Dedup: skip if an identical-title notification was sent for this actor recently
  SELECT count(*) INTO recent_dup
  FROM public.notifications
  WHERE reference_id = NEW.user_id
    AND reference_type = 'security_alert'
    AND title = notif_title
    AND created_at > now() - make_interval(mins => cfg.notification_dedup_minutes);

  IF recent_dup > 0 THEN
    RETURN NEW;
  END IF;

  -- Fan out to all admins / CMD
  INSERT INTO public.notifications (user_id, title, message, type, reference_id, reference_type)
  SELECT ur.user_id, notif_title, notif_message, 'warning', NEW.user_id, 'security_alert'
  FROM public.user_roles ur
  WHERE ur.role IN ('SUPER_ADMIN', 'ADMIN', 'CMD')
    AND ur.user_id <> COALESCE(NEW.user_id, '00000000-0000-0000-0000-000000000000'::uuid);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_admins_on_security_event ON public.audit_logs;
CREATE TRIGGER trg_notify_admins_on_security_event
AFTER INSERT ON public.audit_logs
FOR EACH ROW EXECUTE FUNCTION public.notify_admins_on_security_event();
