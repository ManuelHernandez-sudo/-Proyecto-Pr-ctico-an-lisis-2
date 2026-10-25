INSERT INTO tecnicos (nombre, email) VALUES
  ('Ana Técnica', 'ana.tecnica@example.com'),
  ('Luis Soporte', 'luis.soporte@example.com'),
  ('Marta Redes', 'marta.redes@example.com')
ON CONFLICT DO NOTHING;

INSERT INTO incidentes (titulo, descripcion, categoria, prioridad, usuario, estado, tecnico_id) VALUES
  ('Sin acceso a VPN', 'No puedo conectarme a la VPN desde casa desde esta mañana', 'RED', 'ALTA', 'jperez', 'ASIGNADO', 3),
  ('Impresora piso 2 atascada', 'La impresora del segundo piso no imprime', 'HARDWARE', 'BAJA', 'mlopez', 'NUEVO', NULL),
  ('ERP caído', 'El ERP devuelve error 500 para todo el área de ventas', 'SOFTWARE', 'CRITICA', 'cgomez', 'EN_PROCESO', 1);
