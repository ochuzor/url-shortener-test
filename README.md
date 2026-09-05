# URL Shortener Microservice

A production-ready, high-performance, type-safe URL shortener microservice built with **Node.js** and **TypeScript**, engineered using strict **Clean Architecture**, **Domain-Driven Design (DDD)**, and **Inversion of Control**.

---

## 🤖 Built with Autonomous AI Engineering (Cline + Gemini 3.5 Flash-Lite)

This project was meticulously designed, implemented, tested, and verified using a **Plan-and-Act Autonomous AI Engineering Workflow** powered by **Cline** and **Gemini 3.5 Flash-Lite**, strictly governed by custom workspace `.clinerules`:
1. **Phase 1 (Context Gathering & Discovery):** Explored workspace conventions and established tech stack parameters.
2. **Phase 2 (Architectural Design & Planning):** Formulated a rigorous technical spec and folder structure, awaiting explicit user sign-off before coding.
3. **Phase 3 (Incremental Implementation):** Developed modular, type-safe components file by file with strict adherence to separation of concerns and typed error handling.
4. **Phase 4 (Verification & Testing):** Created a comprehensive automated unit and integration test suite (25 tests total) running via **Vitest** and **Supertest** with a 100% pass rate.

---

## 🏗️ Architectural Breakdown

The microservice follows a strict **Hexagonal / Clean Architecture** pattern ensuring absolute decoupling of business logic from infrastructure frameworks:

- **Domain Layer (`src/domain/`)**: Pure domain models (`ShortenedUrl` entity), typed domain errors (`InvalidUrlError`, `UrlNotFoundError`, `DuplicateCodeError`), and repository port interfaces (`IUrlRepository`). Free of any external frameworks.
- **Application Layer (`src/application/`)**: Orchestrates business logic through use-case services (`CreateShortUrlService`, `ResolveShortUrlService`, `GetUrlStatsService`) and code generator ports.
- **Infrastructure Layer (`src/infrastructure/`)**: Implements persistence (`InMemoryUrlRepository`), base62 collision-safe ID generation (`NanoidCodeGenerator`), and structured logging (`ConsoleLogger`).
- **Transport / Presentation Layer (`src/transport/http/`)**: Express controllers, Zod request validation schemas, error-handling middleware, and routing (`/api/v1/urls`, `/:shortCode`, `/health`).

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+ recommended, tested on v24)
- **npm** (v9+)

### Installation
Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd url-shortener-test
npm install
```

### Running in Development Mode
Start the development server with live reload (`tsx watch`):
```bash
npm run dev
```

### Building for Production
Compile TypeScript code to JavaScript in `dist/`:
```bash
npm run build
```

Start the production build:
```bash
npm start
```

---

## 🧪 Testing

The test suite includes robust **Unit Tests** (domain entities, code generator, use cases) and **End-to-End Integration Tests** (Express endpoints, redirection, analytics, error handling) using **Vitest** and **Supertest**.

Run all 25 automated tests:
```bash
npm test
```

Run tests with code coverage:
```bash
npm run test:coverage
```

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description | Request Body / Params | Response |
|---|---|---|---|---|
| `POST` | `/api/v1/urls` | Shortens a long URL | `{ "url": "https://...", "customCode": "optional" }` | `201 Created` with short URL and metadata |
| `GET` | `/:shortCode` | Redirects to original URL | Path param: `shortCode` | `302 Found` (Redirect) + Click increment |
| `GET` | `/api/v1/urls/:shortCode` | Retrieves URL analytics | Path param: `shortCode` | `200 OK` with click stats & timestamps |
| `GET` | `/health` | Service health check | None | `200 OK` `{ "status": "ok", "timestamp": "..." }` |
