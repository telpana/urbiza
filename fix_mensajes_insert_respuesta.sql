-- Permite al remitente autenticado insertar mensajes como respuesta
-- (cuando el vendedor responde, él es el remitente)
CREATE POLICY "usuario autenticado puede insertar mensajes"
  ON mensajes FOR INSERT
  WITH CHECK (auth.uid() = remitente_id);
