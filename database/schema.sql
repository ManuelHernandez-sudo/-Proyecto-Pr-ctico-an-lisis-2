CREATE TABLE IF NOT EXISTS tecnicos (
  id     SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  email  TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS incidentes (
  id             SERIAL PRIMARY KEY,
  titulo         TEXT NOT NULL,
  descripcion    TEXT NOT NULL,
  categoria      TEXT NOT NULL CHECK (categoria IN ('HARDWARE','SOFTWARE','RED','ACCESOS','OTRO')),
  prioridad      TEXT NOT NULL CHECK (prioridad IN ('BAJA','MEDIA','ALTA','CRITICA')),
  usuario        TEXT NOT NULL,
  estado         TEXT NOT NULL DEFAULT 'NUEVO'
                 CHECK (estado IN ('NUEVO','ASIGNADO','EN_PROCESO','RESUELTO','CERRADO')),
  tecnico_id     INT REFERENCES tecnicos(id),
  creado_en      TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_inc_estado ON incidentes(estado);
CREATE INDEX IF NOT EXISTS idx_inc_prioridad ON incidentes(prioridad);

CREATE TABLE IF NOT EXISTS comentarios (
  id           SERIAL PRIMARY KEY,
  incidente_id INT NOT NULL REFERENCES incidentes(id) ON DELETE CASCADE,
  autor        TEXT NOT NULL,
  texto        TEXT NOT NULL,
  creado_en    TIMESTAMPTZ NOT NULL DEFAULT now()
);
