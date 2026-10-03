# ./README.md

# Sistema de Gestión Bancaria (API & Frontend)

Este repositorio contiene la solución fullstack para el sistema de gestión bancaria. El proyecto está dividido en un backend desarrollado con Java Spring Boot y un frontend desarrollado en Angular.

## Arquitectura de la Aplicación

- **Backend**: Java 17+, Spring Boot 4.x (Spring Data JPA, REST API, PostgreSQL).
- **Frontend**: Angular 21, TypeScript, SCSS / HTML5, Jest.
- **Contenedores**: Docker y Docker Compose para el orquestado de servicios.

---

## Requisitos Previos

Asegúrate de contar con las siguientes herramientas instaladas en tu sistema antes de iniciar:

- **Git**
- **Docker** y **Docker Compose** (Opción recomendada)
- **JDK 17** o superior (Para ejecución local)
- **Node.js** v18+ y **npm** (Para ejecución local)
- **Angular 21 CLI** (Para ejecución local)
- **Maven** (Para ejecución local)
- **postman** (Para pruebas)

---

## Levantar el proyecto

```bash
docker-compose up --build -d
```

## Detener el proyecto

```bash
docker-compose down -v
```

## Detener y borrar logs del proyecto

```bash
docker-compose down -v --remove-orphans
```

## Estructura del Proyecto

```text
.
├── backend_spring/        # Código fuente del Backend (Spring Boot)
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
├── frontend_angular/      # Código fuente del Frontend (Angular)
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml     # Configuración para despliegue global
└── README.md
```

## URL y Puertos de los servicios en postgres

- **Frontend**: http://localhost:80
- **Backend**: http://localhost:8080
- **PostgreSQL**: http://localhost:5432

## API ENDPOINTS

### Clientes

- GET /api/v1/clientes: Lista todos los clientes.

- GET /api/v1/clientes/{id}: Obtiene el detalle de un cliente por su ID.

- POST /api/v1/clientes: Crea un nuevo cliente.

- PUT /api/v1/clientes/{id}: Actualiza la información de un cliente.

- DELETE /api/v1/clientes/{id}: Elimina un cliente.

### Cuentas

- GET /api/v1/cuentas: Lista todas las cuentas.

- GET /api/v1/cuentas/{numeroCuenta}: Obtiene una cuenta por su número.

- POST /api/v1/cuentas: Crea una nueva cuenta asociada a un cliente.

- PUT /api/v1/cuentas/{numeroCuenta}: Actualiza los datos de una cuenta (el clienteId es opcional si no cambia el propietario).

- DELETE /api/v1/cuentas/{numeroCuenta}: Elimina una cuenta.

### Movimientos

- GET /api/v1/movimientos: Consulta el historial de movimientos.

- POST /api/v1/movimientos: Registra un retiro o depósito (valida disponibilidad de saldo y cupo diario).

### Reportes

- GET /api/v1/reportes?clienteId={id}&fechaInicio={YYYY-MM-DD}&fechaFin={YYYY-MM-DD}: Genera el estado de cuenta consolidado en un rango de fechas.

### Correr test

## Backend

```bash
cd backend_spring
./mvnw clean test
```

## Frontend

```bash
cd frontend_angular
npm test
```
