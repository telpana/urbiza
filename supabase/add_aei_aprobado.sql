-- Añadir columna aei_aprobado a usuarios
-- Ejecutar en Supabase → SQL Editor
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS aei_aprobado boolean DEFAULT false;

-- Los que tenían numero_aei antes de este cambio quedan como pendientes (false)
-- El admin los aprobará desde el panel
