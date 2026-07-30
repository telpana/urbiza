-- Columna visitas en propiedades (por si no existe)
ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS visitas integer DEFAULT 0;

-- RPC para incrementar visitas (llamado desde /api/visita)
CREATE OR REPLACE FUNCTION increment_visitas(prop_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE propiedades SET visitas = COALESCE(visitas, 0) + 1 WHERE id = prop_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
