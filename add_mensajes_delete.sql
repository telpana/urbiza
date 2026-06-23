CREATE POLICY "vendedor puede borrar sus mensajes" ON mensajes FOR DELETE USING (auth.uid() = vendedor_id);
