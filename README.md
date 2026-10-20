# Lab 08 — Courses, Fees, DTOs and Tests (NestJS)

## Run

```bash
npm install
npm run start:dev          # http://localhost:3000/api
```

Environment variables (all optional):

| Variable | Values | Effect |
|---|---|---|
| `STORAGE` | `memory` / anything else | `memory` uses `InMemoryCourseStore` (seeded from `data/courses.json`); default is `JsonFileCourseStore` |
| `LOG_TO_FILE` | `true` | Also writes every log line to `logs/app.log` |
| `FEE_POLICY` | `standard` (default) / `merit` | Selects the fee policy at start-up |
| `PORT` | number | Default `3000` |

Examples:

```bash
# macOS / Linux / Git Bash
STORAGE=memory LOG_TO_FILE=true FEE_POLICY=merit npm run start:dev

# Windows PowerShell
$env:STORAGE="memory"; $env:LOG_TO_FILE="true"; $env:FEE_POLICY="merit"; npm run start:dev

# Windows cmd
set FEE_POLICY=merit && npm run start:dev
```

## Endpoints

- `GET /api/courses` (`search`, `department`, `minCredits`, `sort=creditHours`, `order`, `limit`)
- `GET /api/courses/stats`, `GET /api/courses/:code`
- `POST /api/courses`, `PUT|PATCH /api/courses/:code`, `DELETE /api/courses/:code`
- `GET /api/fees/info`, `GET /api/fees/:rollNumber?creditHours=12`
- `GET /api/students`, `GET /api/students/:rollNumber`

## Tests

```bash
npm test          # unit tests (service, fee policies, DTO)
npm run test:e2e  # supertest, store overridden with a memory store
```

Postman: import `postman/Lab08_Tasks.postman_collection.json`, start the server, and run the collection in the Collection Runner (it can be run repeatedly).
