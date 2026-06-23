-- Insertar el usuario particular de prueba
INSERT INTO usuarios (id, nombre, email, telefono, tipo, plan)
VALUES ('5ca8ceba-9785-4177-ac66-96fb4d618e0d', 'juanjuan', 'hellotelpanaparticular@gmail.com', '666850204', 'particular', 'gratis')
ON CONFLICT (id) DO NOTHING;

-- Ver politicas actuales
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'usuarios';
