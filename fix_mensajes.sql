-- Añadir remitente_id a mensajes
ALTER TABLE mensajes ADD COLUMN IF NOT EXISTS remitente_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Ver políticas actuales de mensajes
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'mensajes';
