# 🚗 Car Dealership Inventory System — Developer Setup Guide

> **Goal:** Go from zero to a fully running application in under 5 minutes.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Quick Start](#2-quick-start)
3. [Default Credentials](#3-default-credentials)
4. [Useful URLs](#4-useful-urls)
5. [Running Tests](#5-running-tests)
6. [Code Quality](#6-code-quality)
7. [Environment Configuration](#7-environment-configuration)
8. [Project Scripts](#8-project-scripts)
9. [Troubleshooting](#9-troubleshooting)
10. [Architecture Overview](#10-architecture-overview)

---

## 1. Prerequisites

Ensure the following are installed and available on your `PATH` before proceeding:

| Tool             | Minimum Version | Verify Command             | Notes                                             |
| ---------------- | --------------- | -------------------------- | ------------------------------------------------- |
| **Java (JDK)**   | 21              | `java -version`            | Required by Spring Boot 3.4.1                     |
| **Node.js**      | 18+             | `node -v`                  | Required by the React / Vite frontend             |
| **npm**          | 9+              | `npm -v`                   | Ships with Node.js                                |
| **Docker Desktop** | Latest        | `docker --version`         | Runs the PostgreSQL 16 container                  |
| **Git**          | 2.x+            | `git --version`            | Clone the repository                              |

> **Important:** Docker Desktop must be **running** (not just installed) before starting the backend.

---

## 2. Quick Start

### Step 1 — Clone the repository

```bash
git clone <repository-url>
cd car-dealership
```

### Step 2 — Start the backend (Spring Boot + PostgreSQL)

```bash
cd car-dealership-api
./mvnw spring-boot:run
```

> **What happens automatically:**
> - The `spring-boot-docker-compose` dependency detects `../docker-compose.yml` and starts a **PostgreSQL 16** container.
> - **Flyway** runs all migrations from `src/main/resources/db/migration/`, creating the schema and seeding dev data.
> - The API starts on **port 8080**.
>
> No manual `docker compose up` is needed.

### Step 3 — Start the frontend (React + Vite)

Open a **new terminal**:

```bash
cd car-dealership-web
npm install
npm run dev
```

The frontend starts on **port 5173**.

### Step 4 — Open the app

Navigate to **[http://localhost:5173](http://localhost:5173)** in your browser and log in with the default admin credentials below.

---

## 3. Default Credentials

The Flyway repeatable migration (`R__seed_dev_data.sql`) seeds the following account:

| Field        | Value                    |
| ------------ | ------------------------ |
| **Email**    | `admin@dealership.com`   |
| **Password** | `admin123`               |
| **Username** | `admin_demo`             |
| **Role**     | `ADMIN`                  |

The seed script also inserts **8 sample vehicles** (Toyota Camry, Honda Civic, Ford F-150, etc.) so the inventory is pre-populated for development.

---

## 4. Useful URLs

| Resource             | URL                                                                 |
| -------------------- | ------------------------------------------------------------------- |
| **Frontend**         | [http://localhost:5173](http://localhost:5173)                       |
| **Backend API**      | [http://localhost:8080](http://localhost:8080)                       |
| **Swagger UI**       | [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html) |
| **Actuator Health**  | [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health) |
| **Actuator Info**    | [http://localhost:8080/actuator/info](http://localhost:8080/actuator/info) |
| **Actuator Metrics** | [http://localhost:8080/actuator/metrics](http://localhost:8080/actuator/metrics) |

---

## 5. Running Tests

### Backend (Java / Spring Boot)

```bash
cd car-dealership-api

# Run all tests
./mvnw test

# Run tests with coverage report
./mvnw verify
```

> **Frameworks:** The backend uses **JUnit 5** and **Mockito** for unit testing (mocking dependencies like Repositories/Services).
> 
> **Requirement:** Docker must be running — the backend tests use **Testcontainers** to spin up an isolated PostgreSQL instance for integration testing.

The JaCoCo coverage report is generated at:
```
car-dealership-api/target/site/jacoco/index.html
```

### Frontend (React / Vitest)

```bash
cd car-dealership-web

# Run all tests
npm test

# Or directly via npx
npx vitest

# Run tests in watch mode
npx vitest --watch

# Run with coverage
npx vitest --coverage
```

The frontend uses **Vitest** + **Testing Library** + **MSW** (Mock Service Worker) for API mocking.

---

## 6. Code Quality

### Java — Spotless (Google Java Format)

```bash
cd car-dealership-api

# Check formatting (fails build if violations exist)
./mvnw spotless:check

# Auto-fix formatting
./mvnw spotless:apply
```

Spotless is configured with [Google Java Format](https://github.com/google/google-java-format) in `pom.xml`.

### JavaScript — ESLint + OxLint

```bash
cd car-dealership-web

# Run ESLint
npm run lint
```

The frontend also includes an [OxLint](https://oxc-project.github.io/docs/guide/usage/linter.html) configuration (`.oxlintrc.json`) for fast, Rust-based linting.

### Test Coverage — JaCoCo

JaCoCo is configured via the `jacoco-maven-plugin` (v0.8.11) in `pom.xml`. Coverage is generated during the `verify` phase:

```bash
./mvnw verify
# Report: target/site/jacoco/index.html
```

---

## 7. Environment Configuration

### Backend (`application.properties`)

The main configuration lives in `car-dealership-api/src/main/resources/application.properties`:

| Property                                        | Default Value                          | Description                                       |
| ----------------------------------------------- | -------------------------------------- | ------------------------------------------------- |
| `spring.application.name`                       | `car-dealership-api`                   | Application identifier                            |
| `spring.docker.compose.file`                    | `../docker-compose.yml`               | Path to Docker Compose file for auto-start         |
| `management.endpoints.web.exposure.include`     | `health,info,metrics`                  | Actuator endpoints exposed over HTTP               |
| `management.endpoint.health.show-details`       | `when-authorized`                      | Health endpoint detail visibility                  |

### Development Profile (`application-dev.properties`)

Activate with `--spring.profiles.active=dev`:

| Property                                                  | Value   | Description                    |
| --------------------------------------------------------- | ------- | ------------------------------ |
| `spring.jpa.show-sql`                                     | `true`  | Log all SQL queries            |
| `logging.level.org.springframework.security`              | `DEBUG` | Verbose security logging       |

### JWT Configuration (Hardcoded — Development Only)

JWT settings are currently defined as constants in `JwtService.java` and `RefreshTokenService.java`:

| Setting                    | Value         | Location                        |
| -------------------------- | ------------- | ------------------------------- |
| **JWT Secret Key**         | Hardcoded     | `JwtService.SECRET_KEY`         |
| **Access Token Expiry**    | 15 minutes    | `JwtService.generateToken()`    |
| **Refresh Token Expiry**   | 7 days        | `RefreshTokenService` field     |

> ⚠️ **Production Warning:** The JWT secret key is hardcoded for development convenience. For production, extract it to an environment variable or external configuration (e.g., `application-prod.properties`).

### Database (Docker Compose)

The PostgreSQL container is configured in `docker-compose.yml` at the project root:

| Environment Variable | Value              |
| -------------------- | ------------------ |
| `POSTGRES_DB`        | `car_dealership`   |
| `POSTGRES_USER`      | `postgres`         |
| `POSTGRES_PASSWORD`  | `password`         |
| Port Mapping         | `5432:5432`        |

Spring Boot auto-discovers these via `spring-boot-docker-compose` — no datasource URL configuration is needed during development.

### CORS (Allowed Origins)

Defined in `CorsConfig.java`:

| Allowed Origin             |
| -------------------------- |
| `http://localhost:5173`    |
| `http://localhost:3000`    |

To add more origins, update the `allowedOrigins` list in `CorsConfig.java`.

---

## 8. Project Scripts

### Backend (Maven Wrapper)

All commands run from `car-dealership-api/`:

| Command                           | Description                                   |
| --------------------------------- | --------------------------------------------- |
| `./mvnw spring-boot:run`         | Start the application (+ PostgreSQL via Docker)|
| `./mvnw test`                    | Run unit and integration tests                 |
| `./mvnw verify`                  | Run tests + generate JaCoCo coverage report    |
| `./mvnw spotless:check`          | Check code formatting                          |
| `./mvnw spotless:apply`          | Auto-fix code formatting                       |
| `./mvnw clean install`           | Full clean build                               |
| `./mvnw clean install -DskipTests` | Build without running tests                  |
| `./mvnw dependency:tree`         | Print dependency tree                          |

> **Windows users:** Use `mvnw.cmd` instead of `./mvnw`.

### Frontend (npm)

All commands run from `car-dealership-web/`:

| Command             | Description                               |
| ------------------- | ----------------------------------------- |
| `npm install`       | Install dependencies                      |
| `npm run dev`       | Start Vite dev server (port 5173)         |
| `npm run build`     | Build production bundle                   |
| `npm run preview`   | Preview production build locally          |
| `npm run lint`      | Run ESLint                                |
| `npm test`          | Run Vitest test suite                     |

---

## 9. Troubleshooting

### Docker not running

**Symptom:** Spring Boot fails to start with a connection or Docker-related error.

```
Connection to localhost:5432 refused
```

**Fix:** Start Docker Desktop and ensure the Docker daemon is running, then retry `./mvnw spring-boot:run`.

---

### Port 5432 already in use

**Symptom:** The PostgreSQL container fails to bind to port 5432.

**Fix:** A local PostgreSQL instance is likely occupying the port. Either:

```bash
# Option A: Stop local PostgreSQL
# macOS (Homebrew)
brew services stop postgresql

# Linux
sudo systemctl stop postgresql

# Option B: Change the port in docker-compose.yml
ports:
  - '5433:5432'  # Map to a different host port
```

If you change the port, update `spring.datasource.url` in `application.properties` accordingly.

---

### Port 8080 already in use

**Symptom:** Spring Boot fails to start — `Web server failed to start. Port 8080 was already in use.`

**Fix:**

```bash
# Find and kill the process
lsof -i :8080
kill -9 <PID>

# Or change the port via command line
./mvnw spring-boot:run -Dspring-boot.run.arguments=--server.port=8081
```

---

### Port 5173 already in use

**Symptom:** Vite dev server fails to start or uses a different port.

**Fix:**

```bash
# Find and kill the process
lsof -i :5173
kill -9 <PID>
```

> If Vite auto-selects a different port (e.g., 5174), CORS will block API requests. Either free port 5173 or add the new port to `CorsConfig.java`.

---

### CORS errors in browser console

**Symptom:** API requests from the frontend fail with `Access-Control-Allow-Origin` errors.

**Fix:** Ensure the frontend is running on one of the allowed origins (`http://localhost:5173` or `http://localhost:3000`). If running on a different port, add it to the `allowedOrigins` list in `CorsConfig.java` and restart the backend.

---

### JWT access token expired

**Symptom:** API returns `401 Unauthorized` after ~15 minutes.

**Fix:** Access tokens expire after **15 minutes** by design. Use the refresh token endpoint to obtain a new access token:

```bash
POST http://localhost:8080/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "<your-refresh-token>"
}
```

The response includes a new access token and a rotated refresh token. Refresh tokens are valid for **7 days**.

---

### Flyway migration checksum mismatch

**Symptom:** Application fails to start with a Flyway checksum validation error.

```
Migration checksum mismatch for migration version X
```

**Fix:** **Never** modify an already-applied versioned migration file (e.g., `V1__init_schema.sql`). If you need schema changes:

1. Create a **new** versioned migration: `V3__your_change.sql`
2. If you absolutely must re-run from scratch, delete the Docker volume:

```bash
docker compose down -v   # ⚠️ Destroys all data
./mvnw spring-boot:run   # Re-creates everything
```

---

### Node modules issues

**Symptom:** Frontend build errors after pulling new changes.

**Fix:**

```bash
cd car-dealership-web
rm -rf node_modules package-lock.json
npm install
```

---

## 10. Architecture Overview

The application follows a **layered architecture** pattern:

```
┌──────────────────────────────────────────────────┐
│                React Frontend (Vite)             │ :5173
├──────────────────────────────────────────────────┤
│              REST API (Spring Boot)              │ :8080
│  ┌────────────┬──────────────┬─────────────────┐ │
│  │ Controllers│   Services   │   JwtService    │ │
│  ├────────────┼──────────────┼─────────────────┤ │
│  │ Entities   │ Repositories │ Security Config │ │
│  └────────────┴──────────────┴─────────────────┘ │
├──────────────────────────────────────────────────┤
│           PostgreSQL 16 (Docker)                 │ :5432
└──────────────────────────────────────────────────┘
```

**Key API endpoints:**

| Method   | Endpoint                  | Description                  | Auth Required |
| -------- | ------------------------- | ---------------------------- | ------------- |
| `POST`   | `/api/auth/register`      | Register a new user          | No            |
| `POST`   | `/api/auth/login`         | Login and get JWT tokens     | No            |
| `POST`   | `/api/auth/refresh`       | Refresh access token         | No            |
| `POST`   | `/api/auth/logout`        | Logout and revoke tokens     | Yes           |
| `GET`    | `/api/vehicles`           | List / search vehicles       | Yes           |

For a comprehensive deep-dive into the system architecture, data models, security flow, and design decisions, see **[ARCHITECTURE.md](./ARCHITECTURE.md)**.

---

*Last updated: July 2026*
