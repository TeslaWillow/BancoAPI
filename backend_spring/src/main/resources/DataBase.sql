-- ./src/main/resources/DataBase.sql

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

-- ------------------------------------------
-- 4.1 Personas (ids 1-3 originales, 4-13 nuevas)
-- ------------------------------------------
INSERT INTO persona (id, nombre, genero, edad, identificacion, direccion, telefono) 
VALUES 
(1, 'Jose Lema', 'MASCULINO', 30, '1712345678', 'Otavalo sn y principal', '098254785'),
(2, 'Marianela Montalvo', 'FEMENINO', 28, '1712345679', 'Amazonas y NNUU', '097548965'),
(3, 'Juan Osorio', 'MASCULINO', 35, '1712345680', '13 junio y Equinoccial', '098874587'),
(4, 'Carlos Andrade', 'MASCULINO', 42, '1712345681', 'Av. 6 de Diciembre y Colon', '099123456'),
(5, 'Lucia Fernandez', 'FEMENINO', 31, '1712345682', 'Calle Bolivar 245 y Sucre', '098765432'),
(6, 'Pedro Salazar', 'MASCULINO', 27, '1712345683', 'Av. de los Shyris N35-12', '097654321'),
(7, 'Ana Torres', 'FEMENINO', 39, '1712345684', 'Av. Amazonas y Naciones Unidas', '096543210'),
(8, 'Miguel Paredes', 'MASCULINO', 52, '1712345685', 'Calle Garcia Moreno 112', '095432109'),
(9, 'Sofia Herrera', 'FEMENINO', 24, '1712345686', 'Av. Republica y Eloy Alfaro', '094321098'),
(10, 'Diego Castillo', 'MASCULINO', 45, '1712345687', 'Pasaje Los Pinos Lote 7', '093210987'),
(11, 'Valeria Mendoza', 'FEMENINO', 33, '1712345688', 'Av. 10 de Agosto y Patria', '092109876'),
(12, 'Andres Villacis', 'MASCULINO', 29, '1712345689', 'Calle Rocafuerte 78', '091098765'),
(13, 'Alex Moreno', 'OTRO', 26, '1712345690', 'Av. Occidental y Mariana de Jesus', '090987654')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------
-- 4.2 Clientes
--   - Cliente 10 (dcastillo) esta INACTIVO.
--   - Cliente 13 (amoreno) no tiene cuentas.
-- ------------------------------------------
INSERT INTO cliente (id, cliente_id, contrasena, estado) 
VALUES 
(1, 'jlema', '1234', TRUE),
(2, 'mmontalvo', '5678', TRUE),
(3, 'josorio', '1245', TRUE),
(4, 'candrade', '1111', TRUE),
(5, 'lfernandez', '2222', TRUE),
(6, 'psalazar', '3333', TRUE),
(7, 'atorres', '4444', TRUE),
(8, 'mparedes', '5555', TRUE),
(9, 'sherrera', '6666', TRUE),
(10, 'dcastillo', '7777', FALSE),
(11, 'vmendoza', '8888', TRUE),
(12, 'avillacis', '9999', TRUE),
(13, 'amoreno', '0000', TRUE)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------
-- 4.3 Cuentas
--   - Clientes con varias cuentas: 2, 4, 8.
--   - Cuentas INACTIVAS: 505679, 507890.
--   - Cuentas sin movimientos: 506789, 507890.
-- ------------------------------------------
INSERT INTO cuenta (numero_cuenta, tipo_cuenta, saldo_inicial, estado, cliente_id) 
VALUES 
('478758', 'AHORROS', 2000.00, TRUE, 1),
('225487', 'CORRIENTE', 100.00, TRUE, 2),
('495878', 'AHORROS', 0.00, TRUE, 3),
('496825', 'AHORROS', 540.00, TRUE, 2),
('501234', 'AHORROS', 1500.00, TRUE, 4),
('501235', 'CORRIENTE', 5000.00, TRUE, 4),
('502345', 'AHORROS', 320.50, TRUE, 5),
('503456', 'CORRIENTE', 2500.00, TRUE, 6),
('504567', 'AHORROS', 50.00, TRUE, 7),
('505678', 'AHORROS', 10000.00, TRUE, 8),
('505679', 'CORRIENTE', 750.00, FALSE, 8),
('506789', 'AHORROS', 0.00, TRUE, 9),
('507890', 'CORRIENTE', 1200.00, FALSE, 10),
('508901', 'AHORROS', 860.75, TRUE, 11),
('509012', 'CORRIENTE', 3400.00, TRUE, 12)
ON CONFLICT (numero_cuenta) DO NOTHING;

-- ------------------------------------------
-- 4.4 Movimientos
--   Convencion: los DEPOSITOS llevan valor positivo y los RETIROS valor negativo.
--   "saldo" es el saldo de la cuenta DESPUES del movimiento, encadenado desde
--   saldo_inicial. Ningun saldo queda negativo y ningun retiro supera 1000 por dia.
--   Las fechas son relativas al momento de inicializar la base de datos.
-- ------------------------------------------
INSERT INTO movimientos (id, fecha, tipo_movimiento, valor, saldo, numero_cuenta)
VALUES
-- 478758 (saldo inicial 2000.00)
(1,  CURRENT_TIMESTAMP - INTERVAL '25 days', 'DEPOSITO',  600.00, 2600.00, '478758'),
(2,  CURRENT_TIMESTAMP - INTERVAL '20 days', 'RETIRO',   -575.00, 2025.00, '478758'),
(3,  CURRENT_TIMESTAMP - INTERVAL '12 days', 'DEPOSITO',  150.00, 2175.00, '478758'),
(4,  CURRENT_TIMESTAMP - INTERVAL '3 days',  'RETIRO',   -300.00, 1875.00, '478758'),

-- 225487 (saldo inicial 100.00)
(5,  CURRENT_TIMESTAMP - INTERVAL '22 days', 'DEPOSITO',  600.00,  700.00, '225487'),
(6,  CURRENT_TIMESTAMP - INTERVAL '15 days', 'RETIRO',   -150.00,  550.00, '225487'),
(7,  CURRENT_TIMESTAMP - INTERVAL '6 days',  'DEPOSITO',  200.00,  750.00, '225487'),

-- 495878 (saldo inicial 0.00)
(8,  CURRENT_TIMESTAMP - INTERVAL '18 days', 'DEPOSITO',  100.00,  100.00, '495878'),
(9,  CURRENT_TIMESTAMP - INTERVAL '9 days',  'RETIRO',    -25.00,   75.00, '495878'),
(10, CURRENT_TIMESTAMP - INTERVAL '2 days',  'DEPOSITO',  400.00,  475.00, '495878'),

-- 496825 (saldo inicial 540.00) - queda en saldo 0 tras el primer retiro
(11, CURRENT_TIMESTAMP - INTERVAL '14 days', 'RETIRO',   -540.00,    0.00, '496825'),
(12, CURRENT_TIMESTAMP - INTERVAL '5 days',  'DEPOSITO', 1000.00, 1000.00, '496825'),

-- 501234 (saldo inicial 1500.00)
(13, CURRENT_TIMESTAMP - INTERVAL '28 days', 'DEPOSITO', 2000.00, 3500.00, '501234'),
(14, CURRENT_TIMESTAMP - INTERVAL '21 days', 'RETIRO',   -800.00, 2700.00, '501234'),
(15, CURRENT_TIMESTAMP - INTERVAL '17 days', 'RETIRO',   -450.00, 2250.00, '501234'),
(16, CURRENT_TIMESTAMP - INTERVAL '8 days',  'DEPOSITO',  300.00, 2550.00, '501234'),

-- 501235 (saldo inicial 5000.00) - un retiro exactamente en el limite diario
(17, CURRENT_TIMESTAMP - INTERVAL '26 days', 'RETIRO',  -1000.00, 4000.00, '501235'),
(18, CURRENT_TIMESTAMP - INTERVAL '19 days', 'DEPOSITO', 1500.00, 5500.00, '501235'),
(19, CURRENT_TIMESTAMP - INTERVAL '4 days',  'RETIRO',   -250.00, 5250.00, '501235'),

-- 502345 (saldo inicial 320.50)
(20, CURRENT_TIMESTAMP - INTERVAL '13 days', 'DEPOSITO',   79.50,  400.00, '502345'),
(21, CURRENT_TIMESTAMP - INTERVAL '7 days',  'RETIRO',   -100.00,  300.00, '502345'),

-- 503456 (saldo inicial 2500.00) - valores con centavos
(22, CURRENT_TIMESTAMP - INTERVAL '24 days', 'RETIRO',   -500.00, 2000.00, '503456'),
(23, CURRENT_TIMESTAMP - INTERVAL '16 days', 'DEPOSITO',  750.25, 2750.25, '503456'),
(24, CURRENT_TIMESTAMP - INTERVAL '1 day',   'RETIRO',   -125.25, 2625.00, '503456'),

-- 504567 (saldo inicial 50.00)
(25, CURRENT_TIMESTAMP - INTERVAL '11 days', 'DEPOSITO',   50.00,  100.00, '504567'),
(26, CURRENT_TIMESTAMP - INTERVAL '3 days',  'RETIRO',    -30.00,   70.00, '504567'),

-- 505678 (saldo inicial 10000.00)
(27, CURRENT_TIMESTAMP - INTERVAL '27 days', 'RETIRO',   -900.00,  9100.00, '505678'),
(28, CURRENT_TIMESTAMP - INTERVAL '23 days', 'DEPOSITO', 2500.00, 11600.00, '505678'),
(29, CURRENT_TIMESTAMP - INTERVAL '10 days', 'RETIRO',  -1000.00, 10600.00, '505678'),
(30, CURRENT_TIMESTAMP - INTERVAL '2 days',  'DEPOSITO',  400.00, 11000.00, '505678'),

-- 505679 (saldo inicial 750.00) - cuenta inactiva
(31, CURRENT_TIMESTAMP - INTERVAL '30 days', 'RETIRO',   -250.00,  500.00, '505679'),

-- 508901 (saldo inicial 860.75)
(32, CURRENT_TIMESTAMP - INTERVAL '15 days', 'DEPOSITO',  139.25, 1000.00, '508901'),
(33, CURRENT_TIMESTAMP - INTERVAL '5 days',  'RETIRO',   -200.00,  800.00, '508901'),

-- 509012 (saldo inicial 3400.00)
(34, CURRENT_TIMESTAMP - INTERVAL '29 days', 'RETIRO',   -400.00, 3000.00, '509012'),
(35, CURRENT_TIMESTAMP - INTERVAL '18 days', 'DEPOSITO', 1000.00, 4000.00, '509012'),
(36, CURRENT_TIMESTAMP - INTERVAL '9 days',  'RETIRO',   -650.00, 3350.00, '509012'),
(37, CURRENT_TIMESTAMP - INTERVAL '1 day',   'DEPOSITO',  150.00, 3500.00, '509012')
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- 5. SINCRONIZACIÓN DE SECUENCIAS
-- ==========================================
SELECT setval('persona_id_seq', (SELECT MAX(id) FROM persona));

SELECT setval('movimientos_id_seq', (SELECT MAX(id) FROM movimientos));