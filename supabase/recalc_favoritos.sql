UPDATE propiedades p
SET favoritos = (SELECT COUNT(*) FROM favoritos f WHERE f.propiedad_id = p.id);
