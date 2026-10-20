# Lab 08 — Task 3 results (invalid requests)

These are the real responses from the running API (`POST` / `GET` / `PATCH` against `http://localhost:3000/api`).
Each decorator comment names the decorator that produced the message.

## 1. POST valid, values cleaned — 201
Request: `{ "code": " cs-420 ", "title": "  Compilers ", ... "tags": ["Theory", "CORE"] }`
```json
{ "code": "CS-420", "title": "Compilers", "creditHours": 3, "instructor": "Dr. Hamza Rauf",
  "department": "Computer Science", "tags": ["theory", "core"] }
```
`@Upper()` (code), `@Trim()` (title), `@LowerEach()` (tags) are `@Transform` decorators that clean the values before validation.

## 2. POST with `creditHours: "3"` — 400
```json
{ "statusCode": 400, "error": "Validation failed",
  "details": ["creditHours must be at most 4", "creditHours must be at least 1", "creditHours must be a whole number"] }
```
`@IsInt` produced "must be a whole number" because text is not a number. `@Min` / `@Max` also fail on a string, so they add their messages too.

## 3. POST with `code: "CS3"`, `title: "AI"`, `creditHours: 9` — 400
```json
{ "statusCode": 400, "error": "Validation failed",
  "details": ["code must look like CS-301 or CS-301L", "title must be at least 3 characters", "creditHours must be at most 4"] }
```
`@Matches` → code message, `@MinLength(3)` → title message, `@Max(4)` → creditHours message.

## 4. POST with 6 tags — 400
```json
{ "statusCode": 400, "error": "Validation failed", "details": ["tags can have at most 5 items"] }
```
`@ArrayMaxSize(5)`.

## 5. GET /api/courses?minCredits=abc — 400
```json
{ "statusCode": 400, "error": "Validation failed",
  "details": ["minCredits must be at most 4", "minCredits must be at least 1", "minCredits must be a whole number"] }
```
`@Type(() => Number)` turns "abc" into `NaN`; `@IsInt` rejects it (`@Min` / `@Max` fail on NaN too).

## 6. GET /api/courses?sort=title — 400
```json
{ "statusCode": 400, "error": "Validation failed", "details": ["sort must be creditHours"] }
```
`@IsIn(['creditHours'])`.

## 7. GET /api/courses/abc — 400 (not 404)
```json
{ "statusCode": 400, "error": "Validation failed", "details": ["code must look like CS-301 or CS-301L"] }
```
`@Matches` in `CodeParamDto` fails before the service is reached.

## 8. GET /api/fees/BSCS-023 (no creditHours) — 400
```json
{ "statusCode": 400, "error": "Validation failed",
  "details": ["creditHours must be at most 24", "creditHours must be at least 1", "creditHours must be a whole number"] }
```
`FeeQueryDto.creditHours` is required: `undefined` becomes `NaN`, so `@IsInt`, `@Min`, `@Max` fail.

## 9. PATCH /api/courses/CS-301L with `{ "code": "CS-999" }` — 400
```json
{ "statusCode": 400, "error": "Validation failed", "details": ["property code should not exist"] }
```
`code` was removed by `OmitType`, so `whitelist` + `forbidNonWhitelisted` reject it.

## 10. POST with extra property `"isAdmin": true` — 400
```json
{ "statusCode": 400, "error": "Validation failed", "details": ["property isAdmin should not exist"] }
```
`forbidNonWhitelisted: true` in `createValidationPipe()`.

## Extra: other status codes
- `POST` with an existing code → `409 {"message":"Course CS-101 already exists","error":"Conflict","statusCode":409}`
- `GET /api/fees/NOPE?creditHours=3` → `404 {"message":"Student NOPE not found",...}`
- `DELETE /api/courses/CS-420` → `204` (no body)

## Task 2 proof — same request, two policies (FeesService unchanged)
`FEE_POLICY=standard`: `GET /api/fees/BSCS-023?creditHours=12` → `"policy":"standard", "total":60000`
`FEE_POLICY=merit`:    `GET /api/fees/BSCS-023?creditHours=12` → `"policy":"merit", "total":30000`
`GET /api/fees/info` → `{"policy":"merit","ratePerCreditHour":5000}`

## Task 1 proof — logs/app.log (`LOG_TO_FILE=true`)
```
[2026-10-20T18:50:50.458Z] Using file storage
[2026-10-20T18:50:50.459Z] Using standard fee policy (rate 5000 per credit hour)
[2026-10-20T18:50:52.970Z] Created course CS-420
[2026-10-20T18:50:52.983Z] Deleted course CS-420
```
