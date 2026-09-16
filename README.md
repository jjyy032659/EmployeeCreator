# Employee Creator

A full-stack application to create, list, modify and delete employees. Spring Boot REST API backed by MySQL, React TypeScript frontend, containerised with Docker and deployed to AWS with Terraform.

**Live demo:** http://3.27.167.53

> The demo runs on HTTP only. Infrastructure is defined in Terraform and torn down when not in use — see [Infrastructure](#infrastructure) for how to recreate it.

---

## Contents

- [Stack](#stack)
- [Architecture](#architecture)
- [Data model](#data-model)
- [API](#api)
- [Running locally](#running-locally)
- [Testing](#testing)
- [Infrastructure](#infrastructure)
- [CI](#ci)
- [Design decisions](#design-decisions)
- [Known gaps](#known-gaps)

---

## Stack

**Backend**
- Java 21, Spring Boot 4.1.1
- Spring Data JPA / Hibernate, MySQL 8.4
- Jakarta Bean Validation
- Log4j2
- JUnit 5, Mockito, MockMvc, H2

**Frontend**
- React 19, TypeScript, Vite
- TanStack Query (React Query) for server state
- React Hook Form + Zod for forms and validation
- React Router
- Tailwind CSS
- Vitest, React Testing Library

**Infrastructure**
- Docker (multi-stage builds), docker-compose
- Terraform (VPC, EC2, RDS, ECR, IAM)
- GitHub Actions

---

## Architecture

### Application layers

```
Controller   HTTP concerns — routing, status codes, JSON
    ↓
Service      business rules and orchestration
    ↓
Repository   database access via Spring Data JPA
    ↓
Entity       maps to the employees table
```

Each layer depends only on the one below it. The service has no knowledge of HTTP, which means it can be unit tested without a web server; the repository is an interface, which means the service can be tested without a database.

### Request flow in production

```
Browser
   │  http://<ec2-ip>
   ▼
nginx (container)
   ├── /          → serves the React build
   └── /api/*     → reverse-proxies to the API container
                        ↓
                    Spring Boot (container)
                        ↓  port 3306
                    RDS MySQL (no public access)
```

The frontend and API are served from the same origin, so CORS does not apply in production. A CORS config exists for local development, where Vite runs on port 5173 and the API on 8080.

---

## Data model

The schema was left to the candidate; these fields are derived from the supplied design snippets.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | `Long` | auto | `AUTO_INCREMENT` |
| `firstName` | `String(50)` | yes | |
| `middleName` | `String(50)` | no | "if applicable" in the design |
| `lastName` | `String(50)` | yes | |
| `email` | `String(255)` | yes | unique constraint |
| `mobileNumber` | `String(20)` | yes | Australian format |
| `address` | `String(255)` | yes | |
| `contractType` | enum | yes | `PERMANENT` / `CONTRACT` |
| `startDate` | `LocalDate` | yes | cannot be in the future |
| `finishDate` | `LocalDate` | no | required unless `ongoing` |
| `ongoing` | `boolean` | yes | the "On going" checkbox |
| `employmentBasis` | enum | yes | `FULL_TIME` / `PART_TIME` |
| `hoursPerWeek` | `Integer` | yes | 1–168 |

The "Contract – 2yrs" line on the list screen is **computed** from `startDate` at render time rather than stored, so it cannot go stale.

---

## API

| Method | Path | Purpose | Success | Errors |
|---|---|---|---|---|
| GET | `/employees` | List all | 200 | — |
| GET | `/employees/{id}` | Fetch one | 200 | 404 |
| POST | `/employees` | Create | 200 | 400, 409 |
| PUT | `/employees/{id}` | Update | 200 | 400, 404, 409 |
| DELETE | `/employees/{id}` | Delete | 200 | 404 |

### Error responses

A `@RestControllerAdvice` maps exceptions to structured responses rather than leaking Spring's default stack traces.

**404 — employee not found**
```json
{
  "timestamp": "2026-09-15T23:14:04.541Z",
  "status": 404,
  "message": "Employee not found with id: 999"
}
```

**400 — validation failure**
```json
{
  "timestamp": "2026-09-15T23:14:04.541Z",
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "firstName": "First name is required",
    "email": "Must be a valid email address"
  }
}
```

The `errors` object is keyed by field name so the React form can map messages directly onto inputs.

**409 — duplicate email**
```json
{
  "timestamp": "2026-09-15T23:14:04.541Z",
  "status": 409,
  "message": "An employee with that email already exists"
}
```

The 409 message is deliberately generic — the underlying database constraint violation is not echoed to the client.

---

## Running locally

### Option A — Docker Compose (recommended)

Runs the API, the frontend and MySQL together. Nothing to install beyond Docker.

```bash
git clone <repository-url>
cd employee-creator

echo "DB_PASSWORD=your-password" > .env

docker compose up --build
```

Open **http://localhost**.

Stop with `docker compose down`, or `docker compose down -v` to also delete the database volume.

### Option B — Run each part directly

**Prerequisites:** JDK 21, Node 20+, MySQL 8.x running locally.

**1. Create the database**

```sql
CREATE DATABASE employee_creator_db;
```

**2. Start the API**

```bash
cd api
export DB_PASSWORD=your-mysql-password
./mvnw spring-boot:run
```

Runs on http://localhost:8080. Hibernate creates the schema on first boot (`ddl-auto=update`).

**3. Start the frontend**

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Runs on http://localhost:5173.

The database password is read from the `DB_PASSWORD` environment variable rather than being committed — see `api/src/main/resources/application.properties`.

---

## Testing

### Backend — 11 tests

```bash
cd api
./mvnw test
```

**Unit tests** (`EmployeeServiceTest`) use Mockito to replace the repository, so business logic is tested without a database. The delete-when-missing test verifies that `deleteById` is never reached, proving the guard clause actually guards rather than merely throwing afterwards.

**Integration tests** (`EmployeeControllerIntegrationTest`) run the full Spring context against an in-memory H2 database using MockMvc. These cover routing, JSON serialisation, status codes and the shape of the validation error response.

No MySQL instance is required to run the test suite.

### Frontend — 13 tests

```bash
cd client
npm run test:run
```

React Testing Library with Vitest. Covers loading, populated, empty and error states on the list; delete confirmation behaviour; and the form's validation rules including the cross-field ongoing/finish-date interaction.

Queries use `getByRole` and `getByLabelText` rather than test IDs or class names, so the tests exercise the same accessible markup a screen reader would.

**Two real bugs were found by writing these tests:**

1. Native browser validation on `<input type="email">` was blocking form submission before React Hook Form ran, so no Zod rules executed at all. Fixed by adding `noValidate` to the form — client validation is now solely the application's responsibility, which keeps messages and styling consistent across browsers.
2. Zod 4 deprecated the chained `.string().email()` in favour of a top-level `z.email()`. The chained call silently did nothing, meaning email format was never validated. Replaced with an explicit regex.

Neither would have surfaced through manual testing of the happy path.

---

## Infrastructure

### What Terraform creates

| Resource | Purpose |
|---|---|
| VPC `10.0.0.0/16` | isolated network |
| 2 public subnets | across two AZs — RDS requires a subnet group spanning two |
| Internet gateway + route table | outbound and inbound connectivity |
| EC2 security group | 80 from anywhere, 22 from a single configured IP |
| RDS security group | **3306 from the EC2 security group only** |
| RDS MySQL 8.4 | `publicly_accessible = false` |
| 2 ECR repositories | with lifecycle policies retaining the last 3 images |
| IAM role + instance profile | lets EC2 authenticate to ECR without stored credentials |
| EC2 t3.micro | runs both containers via docker-compose |

### Security notes

**The database is not reachable from the internet.** The RDS security group references the EC2 security group by ID rather than a CIDR range:

```hcl
ingress {
  from_port       = 3306
  to_port         = 3306
  protocol        = "tcp"
  security_groups = [aws_security_group.ec2.id]
}
```

This is more robust than an IP allowlist — the instance's address can change without breaking the rule — and it means the database accepts connections from the application tier and nothing else.

**No AWS credentials exist on the instance.** An IAM role attached via an instance profile grants ECR read access; temporary credentials are supplied by the instance metadata service and rotated automatically.

**Secrets are not committed.** `terraform.tfvars` and `terraform.tfstate` are gitignored — the state file stores the database password in plaintext. `terraform.tfvars.example` documents the required variables.

### Deploying

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# fill in db_password and my_ip (curl ifconfig.me, then append /32)

terraform init
terraform apply
```

Then build and push the images, and recreate the instance so it picks them up:

```bash
ACCOUNT=<your-account-id>
REGION=ap-southeast-2
REGISTRY=$ACCOUNT.dkr.ecr.$REGION.amazonaws.com

aws ecr get-login-password --region $REGION \
  | docker login --username AWS --password-stdin $REGISTRY

cd api
docker build --platform linux/amd64 -t $REGISTRY/employee-creator-api:latest .
docker push $REGISTRY/employee-creator-api:latest

cd ../client
docker build --platform linux/amd64 --build-arg VITE_API_URL=/api \
  -t $REGISTRY/employee-creator-client:latest .
docker push $REGISTRY/employee-creator-client:latest

cd ../terraform
terraform apply -replace="aws_instance.app"
```

The `app_url` output gives you the address. Allow 3–4 minutes after apply for the startup script to install Docker, authenticate to ECR and pull both images.

> **Windows/Git Bash:** prefix the client build with `MSYS_NO_PATHCONV=1`. Git Bash rewrites arguments beginning with `/` into Windows paths, which silently turns `VITE_API_URL=/api` into a local filesystem path and compiles it into the JavaScript bundle.

### Tearing down

```bash
terraform destroy
```

Roughly five minutes. Note this also deletes the ECR images (`force_delete = true`) and the database (`skip_final_snapshot = true`), so a rebuild requires pushing the images again. Running cost is approximately $27/month, dominated by RDS.

### Production differences

Settings chosen for a disposable demo that would differ in production:

- `backup_retention_period = 0`, `skip_final_snapshot = true`, `deletion_protection = false` — so the stack can be destroyed cleanly and cheaply
- `multi_az = false` — single AZ
- RDS sits in public subnets; production would use private subnets with a NAT gateway for outbound access
- HTTP only; production would terminate TLS at an ALB with an ACM certificate
- `ddl-auto=update` lets Hibernate manage the schema; production would use `validate` with Flyway or Liquibase migrations
- The IAM user running Terraform has broad managed policies; production would use scoped custom policies

---

## CI

`.github/workflows/ci.yml` runs on every push and pull request to `main`. Two parallel jobs:

- **Backend** — `./mvnw clean test` against H2
- **Frontend** — `npm ci`, `npm run test:run`, then `npm run build`

The build step matters as much as the tests: `npm run dev` never runs `tsc`, so type errors are invisible locally and would otherwise only surface during a production build.

---

## Design decisions

**A request DTO rather than exposing the entity.** `CreateEmployeeRequest` has no `id` field, so clients cannot attempt to set the primary key. It also decouples the API contract from the database schema — the entity can change without breaking clients — and keeps validation annotations off a class whose job is describing a table.

**`@Enumerated(EnumType.STRING)`.** The JPA default stores an enum's ordinal position as an integer. Inserting a value into the middle of an enum later would silently change the meaning of every existing row. Storing the name costs a little disk and is immune to reordering.

**`Integer hoursPerWeek`, not `int`.** A primitive `int` defaults to `0` when unset, making "works zero hours" indistinguishable from "not provided" — and `@NotNull` on a primitive can never fail. `ongoing` is deliberately a primitive `boolean`, because a missing checkbox genuinely means false.

**Constructor injection.** Dependencies are `private final` and passed through the constructor rather than annotated with `@Autowired`. This makes the fields immutable and lets tests construct the service directly with mocks, no Spring context required.

**PUT rather than PATCH.** The edit screen displays and submits every field, so a full replacement matches the interaction. PATCH would require null-checking each field to distinguish "unchanged" from "cleared".

**Cross-field rules in a Zod `.refine`.** "Finish date is required unless the role is ongoing" spans three fields, so it cannot be expressed as a field-level validator. The `path` option attaches the message to the finish date input, where a user would expect to fix it.

**Logging to stdout.** The Log4j2 config writes to the console rather than a rolling file. A container's filesystem is ephemeral, so file logs disappear with the container; stdout is what the platform collects.

**A hand-written mapper.** DTO-to-entity conversion is explicit rather than using MapStruct or ModelMapper. For a single entity the generated version saves little, and explicit field assignment is easier to read and reason about.

---

## Known gaps

**Cross-field validation is client-side only.** The ongoing/finish-date rule and the date-ordering rule exist in the Zod schema but have no equivalent in the Java DTO. Client validation is user experience; the server is what guarantees correctness. A request made directly to the API could store an employee marked not-ongoing with no finish date. The fix is a custom class-level constraint annotation on `CreateEmployeeRequest`.

**HTTP only.** The deployed API has no TLS. Adding it requires a domain plus either Caddy on the instance for Let's Encrypt, or an ALB with an ACM certificate.

**No pagination.** `GET /employees` returns every row. Fine at this scale; a real dataset would need `Pageable`.

**Confirmation uses `window.confirm`.** Functional but unstyled, and it blocks the main thread. A modal component would be better.

**Terraform state is local.** A team setup would use an S3 backend with DynamoDB state locking so the state is shared and concurrent applies are prevented.

**H2 is not MySQL.** Integration tests run against an in-memory database with a slightly different SQL dialect. This project writes no native queries, so the risk is low, but Testcontainers would give higher fidelity.
