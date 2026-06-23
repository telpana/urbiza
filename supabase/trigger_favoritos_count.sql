CREATE OR REPLACE FUNCTION sync_favoritos_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE propiedades SET favoritos = COALESCE(favoritos, 0) + 1 WHERE id = NEW.propiedad_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE propiedades SET favoritos = GREATEST(COALESCE(favoritos, 0) - 1, 0) WHERE id = OLD.propiedad_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_favoritos_count ON favoritos;
CREATE TRIGGER trg_favoritos_count
AFTER INSERT OR DELETE ON favoritos
FOR EACH ROW EXECUTE FUNCTION sync_favoritos_count();
