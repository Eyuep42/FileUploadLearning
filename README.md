# ImgScan

A simple full‑stack image/document upload and viewer application.

This repository contains:
- Backend: Java 17 + Spring Boot 3 (Gradle)
- Frontend: React + TypeScript (Vite)
- Database: PostgreSQL (via Docker Compose)

The backend exposes REST endpoints under /api/document for uploading files and listing/downloading them. The frontend provides a minimal UI to upload and view files.

## Tech Stack
- Java 17
- Spring Boot 3 (Web, Data JPA)
- PostgreSQL
- Gradle
- React 19 + TypeScript, Vite

## Requirements
- Java 17 (JDK)
- Node.js 20+ and npm (for the frontend)
- Docker and Docker Compose (for local PostgreSQL)
- Bash/PowerShell terminal

## Project Structure
```
.
├─ build.gradle                 # Backend build (Gradle)
├─ docker-compose.yaml          # Local PostgreSQL
├─ src/                         # Backend source (Spring Boot)
│  ├─ main/java/org/demo/imgscan
│  │  ├─ ImgScanApplication.java             # Spring Boot entry point
│  │  └─ Controller/
│  │     ├─ DocumentFileController.java      # /api/document endpoints
│  │     └─ WebConfig.java                   # CORS config (allows http://localhost:5173)
│  └─ main/resources/application.properties  # DB config
├─ img-frontend/                # Frontend (Vite React TS)
│  ├─ package.json              # Frontend scripts
│  └─ src/
│     ├─ main.tsx               # Frontend entry point
│     └─ App.tsx
└─ uploads/                     # Local file storage (backend) [if used by service]
```

## Services and Ports
- Backend (Spring Boot): default 8080 (standard Spring Boot) [TODO: confirm if overridden]
- Frontend (Vite dev server): 5173
- Database (PostgreSQL): 5432 (host) → 5432 (container)

CORS is configured to allow http://localhost:5173 to access backend routes under /api/**.

## Environment Configuration
Backend configuration (src/main/resources/application.properties):
```
spring.application.name=ImgScan
spring.datasource.url=jdbc:postgresql://localhost:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=example
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Override these via environment variables when needed (Spring Boot supports SPRING_DATASOURCE_URL, SPRING_DATASOURCE_USERNAME, SPRING_DATASOURCE_PASSWORD, etc.).

Known/assumed env vars:
- SPRING_DATASOURCE_URL (default jdbc:postgresql://localhost:5432/postgres)
- SPRING_DATASOURCE_USERNAME (default postgres)
- SPRING_DATASOURCE_PASSWORD (default example)

TODOs:
- TODO: Confirm backend server port (server.port)
- TODO: Document storage location for uploaded files (local folder vs DB). The presence of `uploads/` suggests local filesystem.
- TODO: Add production deployment guidance.

## Setup
1) Start PostgreSQL using Docker Compose (from repository root):
```
docker compose up -d
```
This starts a postgres service with password example and exposes port 5432.

2) Start the backend (from repository root):
- Using Gradle wrapper:
```
./gradlew bootRun
```
- Or build a jar and run:
```
./gradlew build
java -jar build/libs/ImgScan-0.0.1-SNAPSHOT.jar
```

3) Start the frontend (in img-frontend directory):
```
cd img-frontend
npm install
npm run dev
```
The Vite dev server runs at http://localhost:5173.

## API Overview
Base URL: http://localhost:8080/api/document

Endpoints (from DocumentFileController):
- POST /upload — multipart/form-data with file field `file` to upload a document
- GET /{filename} — download file by name
- GET / — list DocumentFile metadata

Note: CORS allows requests from http://localhost:5173.

