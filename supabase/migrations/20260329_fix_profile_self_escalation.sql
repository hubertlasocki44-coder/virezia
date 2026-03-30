-- Fix: Prevent users from escalating their own role/status
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "profiles: users update own" ON public.profiles;

-- Recreate with column restrictions — users can only update safe fields
CREATE POLICY "profiles: users update own safe fields"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
    AND status = (SELECT status FROM public.profiles WHERE id = auth.uid())
  );
