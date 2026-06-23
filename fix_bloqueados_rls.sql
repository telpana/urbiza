ALTER TABLE bloqueados ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ver propios bloqueos" ON bloqueados;
DROP POLICY IF EXISTS "insertar propio bloqueo" ON bloqueados;
DROP POLICY IF EXISTS "borrar propio bloqueo" ON bloqueados;

CREATE POLICY "ver propios bloqueos" ON bloqueados FOR SELECT USING (auth.uid() = bloqueador_id OR auth.uid() = bloqueado_id);
CREATE POLICY "insertar propio bloqueo" ON bloqueados FOR INSERT WITH CHECK (auth.uid() = bloqueador_id);
CREATE POLICY "borrar propio bloqueo" ON bloqueados FOR DELETE USING (auth.uid() = bloqueador_id);
