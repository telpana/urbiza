-- Ver politicas de la tabla usuarios
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'usuarios';

-- Ver si el usuario existe en auth.users
SELECT id, email FROM auth.users WHERE email = 'hellotelpanaparticular@gmail.com';
