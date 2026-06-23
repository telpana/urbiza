SELECT policyname, cmd FROM pg_policies WHERE tablename = 'bloqueados';
SELECT column_name FROM information_schema.columns WHERE table_name = 'bloqueados';
