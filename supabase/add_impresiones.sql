-- Añadir columna impresiones a propiedades
ALTER TABLE propiedades ADD COLUMN IF NOT EXISTS impresiones integer DEFAULT 0;

-- Función para incrementar impresiones en batch
CREATE OR REPLACE FUNCTION increment_impresiones(prop_ids uuid[])
RETURNS void AS $$
BEGIN
  UPDATE propiedades SET impresiones = COALESCE(impresiones, 0) + 1 WHERE id = ANY(prop_ids);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
