-- Fix RLS policies for tables that have RLS enabled but no policies

-- digital_signatures policies
CREATE POLICY "Users can view signatures on their documents"
ON digital_signatures FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM documents d
    WHERE d.id = digital_signatures.document_id
    AND (d.created_by = auth.uid() OR d.assigned_to = auth.uid())
  )
);

CREATE POLICY "Users can create signatures on assigned documents"
ON digital_signatures FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM documents d
    WHERE d.id = document_id
    AND (d.created_by = auth.uid() OR d.assigned_to = auth.uid() OR d.current_approver = auth.uid())
  )
);

-- document_comments policies
CREATE POLICY "Users can view comments on documents they can access"
ON document_comments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM documents d
    WHERE d.id = document_comments.document_id
    AND (d.created_by = auth.uid() OR d.assigned_to = auth.uid())
  )
);

CREATE POLICY "Users can create comments on documents they can access"
ON document_comments FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM documents d
    WHERE d.id = document_id
    AND (d.created_by = auth.uid() OR d.assigned_to = auth.uid())
  )
);

CREATE POLICY "Users can update their own comments"
ON document_comments FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments"
ON document_comments FOR DELETE
USING (user_id = auth.uid());

-- document_versions policies
CREATE POLICY "Users can view versions of documents they can access"
ON document_versions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM documents d
    WHERE d.id = document_versions.document_id
    AND (d.created_by = auth.uid() OR d.assigned_to = auth.uid())
  )
);

CREATE POLICY "Users can create versions of their documents"
ON document_versions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM documents d
    WHERE d.id = document_id
    AND d.created_by = auth.uid()
  )
);

-- form_fields policies
CREATE POLICY "Anyone can view form fields"
ON form_fields FOR SELECT
USING (true);

CREATE POLICY "Admins can manage form fields"
ON form_fields FOR ALL
USING (is_admin(auth.uid()));

-- form_templates policies
CREATE POLICY "Anyone can view form templates"
ON form_templates FOR SELECT
USING (true);

CREATE POLICY "Admins can create form templates"
ON form_templates FOR INSERT
WITH CHECK (is_admin(auth.uid()) OR created_by = auth.uid());

CREATE POLICY "Admins can update form templates"
ON form_templates FOR UPDATE
USING (is_admin(auth.uid()) OR created_by = auth.uid());

-- Fix search_path for existing functions
CREATE OR REPLACE FUNCTION public.get_department_hierarchy(dept_id uuid)
RETURNS TABLE(id uuid, name text, level integer, path text[])
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH RECURSIVE dept_tree AS (
    SELECT 
      d.id,
      d.name,
      d.level,
      ARRAY[d.name] as path
    FROM public.departments d
    WHERE d.id = dept_id
    
    UNION ALL
    
    SELECT 
      parent.id,
      parent.name,
      parent.level,
      parent.name || tree.path
    FROM public.departments parent
    JOIN dept_tree tree ON tree.id = (
      SELECT d.parent_id FROM public.departments d WHERE d.id = tree.id
    )
    WHERE parent.id IS NOT NULL
  )
  SELECT * FROM dept_tree ORDER BY level;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RAISE NOTICE 'Creating user profile for ID: %, Email: %, Role: %, Dept: %',
    new.id,
    new.email,
    new.raw_user_meta_data->>'role',
    new.raw_user_meta_data->>'department';

  BEGIN
    INSERT INTO public.users (id, first_name, last_name, email, role, department)
    VALUES (
      new.id,
      COALESCE(new.raw_user_meta_data->>'first_name', 'UNKNOWN'),
      COALESCE(new.raw_user_meta_data->>'last_name', 'UNKNOWN'),
      new.email,
      COALESCE(new.raw_user_meta_data->>'role', 'STAFF'),
      COALESCE(new.raw_user_meta_data->>'department', 'Administration')
    );
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'User creation failed: %', SQLERRM;
      RETURN new;
  END;

  RETURN new;
END;
$$;