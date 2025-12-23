-- Phase 1 Step 1: Add HEAD_OF_UNIT role to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'HEAD_OF_UNIT';