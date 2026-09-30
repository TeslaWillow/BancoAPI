-- ./src/main/resources/BaseDatos.sql

-- ==========================================
-- 1. ENUMS
-- ==========================================


CREATE TYPE genero_enum AS ENUM ('MASCULINO', 'FEMENINO', 'OTRO');

CREATE TYPE tipo_cuenta_enum AS ENUM ('AHORROS', 'CORRIENTE');

CREATE TYPE tipo_movimiento_enum AS ENUM ('RETIRO', 'DEPOSITO');


-- ==========================================
-- 2. CREACIÓN DE TABLAS
-- ==========================================

-- Tabla Base: Persona
CREATE TABLE IF NOT EXISTS persona (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    genero genero_enum NOT NULL,
    edad INT NOT NULL,
    identificacion VARCHAR(20) NOT NULL UNIQUE,
    direccion VARCHAR(200) NOT NULL,
    telefono VARCHAR(20) NOT NULL
);

-- Tabla Derivada: Cliente (Hereda de Persona mediante PK/FK)
CREATE TABLE IF NOT EXISTS cliente (
    id BIGINT PRIMARY KEY,
    cliente_id VARCHAR(50) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_cliente_persona FOREIGN KEY (id) REFERENCES persona(id) ON DELETE CASCADE
);

-- Tabla: Cuenta
CREATE TABLE IF NOT EXISTS cuenta (
    numero_cuenta VARCHAR(20) PRIMARY KEY,
    tipo_cuenta tipo_cuenta_enum NOT NULL,
    saldo_inicial NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    estado BOOLEAN NOT NULL DEFAULT TRUE,
    cliente_id BIGINT NOT NULL,
    CONSTRAINT fk_cuenta_cliente FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE CASCADE
);

-- Tabla: Movimientos
CREATE TABLE IF NOT EXISTS movimientos (
    id BIGSERIAL PRIMARY KEY,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tipo_movimiento tipo_movimiento_enum NOT NULL,
    valor NUMERIC(15, 2) NOT NULL,
    saldo NUMERIC(15, 2) NOT NULL,
    numero_cuenta VARCHAR(20) NOT NULL,
    CONSTRAINT fk_movimientos_cuenta FOREIGN KEY (numero_cuenta) REFERENCES cuenta(numero_cuenta) ON DELETE CASCADE
);


-- ==========================================
-- 3. ÍNDICES PARA OPTIMIZAR CONSULTAS
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_persona_identificacion ON persona(identificacion);

CREATE INDEX IF NOT EXISTS idx_cliente_id ON cliente(cliente_id);

CREATE INDEX IF NOT EXISTS idx_movimientos_fecha ON movimientos(fecha);

CREATE INDEX IF NOT EXISTS idx_movimientos_cuenta_fecha ON movimientos(numero_cuenta, fecha);

-- ==========================================
-- 4. SEED DE DATOS INICIALES
-- ==========================================

INSERT INTO persona (id, nombre, genero, edad, identificacion, direccion, telefono) 
VALUES 
(1, 'Jose Lema', 'MASCULINO', 30, '1712345678', 'Otavalo sn y principal', '098254785'),
(2, 'Marianela Montalvo', 'FEMENINO', 28, '1712345679', 'Amazonas y NNUU', '097548965'),
(3, 'Juan Osorio', 'MASCULINO', 35, '1712345680', '13 junio y Equinoccial', '098874587')
ON CONFLICT (id) DO NOTHING;

INSERT INTO cliente (id, cliente_id, contrasena, estado) 
VALUES 
(1, 'jlema', '1234', TRUE),
(2, 'mmontalvo', '5678', TRUE),
(3, 'josorio', '1245', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO cuenta (numero_cuenta, tipo_cuenta, saldo_inicial, estado, cliente_id) 
VALUES 
('478758', 'AHORROS', 2000.00, TRUE, 1),
('225487', 'CORRIENTE', 100.00, TRUE, 2),
('495878', 'AHORROS', 0.00, TRUE, 3),
('496825', 'AHORROS', 540.00, TRUE, 2)
ON CONFLICT (numero_cuenta) DO NOTHING;

-- ==========================================
-- 5. SINCRONIZACIÓN DE SECUENCIAS
-- ==========================================
SELECT setval('persona_id_seq', (SELECT MAX(id) FROM persona));