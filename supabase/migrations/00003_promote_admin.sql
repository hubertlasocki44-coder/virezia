UPDATE public.profiles 
SET role = 'super_admin', 
    status = 'active',
    full_name = 'Lucas Hubert',
    verified_at = NOW()
WHERE id = '8f9a5427-796b-4581-9127-dc3cfae42ea5';

-- Also add all employee permissions
INSERT INTO public.employee_permissions (user_id, modules)
VALUES ('8f9a5427-796b-4581-9127-dc3cfae42ea5', 
  ARRAY['leads', 'blog', 'applications', 'users', 'partners', 'properties', 'analytics', 'settings', 'audits', 'briefs'])
ON CONFLICT DO NOTHING;
