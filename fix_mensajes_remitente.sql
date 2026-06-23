-- Permite al remitente leer sus propios mensajes enviados
CREATE POLICY "remitente puede ver sus mensajes enviados"
  ON mensajes FOR SELECT
  USING (auth.uid() = remitente_id);
