CREATE TABLE IF NOT EXISTS bloqueados (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  bloqueador_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  bloqueado_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(bloqueador_id, bloqueado_id)
);
ALTER TABLE bloqueados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ver propios bloqueos" ON bloqueados FOR SELECT USING (auth.uid() = bloqueador_id OR auth.uid() = bloqueado_id);
CREATE POLICY "insertar propio bloqueo" ON bloqueados FOR INSERT WITH CHECK (auth.uid() = bloqueador_id);
CREATE POLICY "borrar propio bloqueo" ON bloqueados FOR DELETE USING (auth.uid() = bloqueador_id);
