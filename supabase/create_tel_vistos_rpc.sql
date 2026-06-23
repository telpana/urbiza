CREATE OR REPLACE FUNCTION increment_tel_vistos(prop_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE propiedades SET tel_vistos = COALESCE(tel_vistos, 0) + 1 WHERE id = prop_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
