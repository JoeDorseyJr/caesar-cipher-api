# Caesar Cipher API

A simple API to encrypt and decrypt text using the Caesar Cipher algorithm.
Built with Bun and Hono.

---

## Quickstart

### Prerequisites

* Bun installed (v1.0 or later recommended)
* PostgreSQL database (for authentication features)
* Docker and Docker Compose (optional, for running Postgres locally)

### Environment Setup

#### Option 1: Using Docker Compose (Recommended)

Start the PostgreSQL database:

```shell
docker compose up db
```

This will start PostgreSQL on `localhost:5432` with the credentials specified in `docker-compose.yml`.

#### Option 2: Using existing PostgreSQL

If you have PostgreSQL installed locally or remotely, update the `DATABASE_URL` in your `.env.local` file.

#### Configure Environment Variables

Copy the `.env.example` file to `.env.local` and configure your environment variables:

```shell
cp api/.env.example api/.env.local
```

Required environment variables:

- **PORT**: HTTP server port (default: 3000)
- **DATABASE_URL**: PostgreSQL connection string (e.g., `postgresql://postgres:postgres@localhost:5432/caesar_cipher`)
- **JWT_SECRET**: Secret key for JWT authentication (minimum 10 characters, change in production!)
- **NODE_ENV**: Application environment (`development`, `production`, or `test`)

See `api/.env.example` for complete documentation and default values.

### Install dependencies

```shell
cd api
bun install
```

### Database Setup

Run migrations to create the database schema:

```shell
bun run migrate
```

Seed test credentials for local development:

```shell
bun run seed:local
```

**Important**: Save the API token displayed by the seed script. You'll need it to authenticate requests.

### Run the server

**Development mode (with hot reload):**

```shell
bun run dev
```

**Production build:**

```shell
# Build the application
bun run build

# Run the production build
bun run start
```

Server will start at:
[http://localhost:3000](http://localhost:3000)

Override the port if needed:

```shell
PORT=4000 bun run dev
```

---

## Authentication

All cipher endpoints (POST requests) require authentication using Bearer tokens. Public endpoints (`/health` and `/info`) do not require authentication.

### Getting an API Token

Run the seed script to generate a test token:

```shell
cd api
bun run seed:local
```

The script will output an API token. Save this token for making authenticated requests.

### Using the Token

Include the token in the `Authorization` header:

```bash
curl -X POST http://localhost:3000/encrypt \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"text": "Hello, World!", "shift": 3}'
```

### Protected Endpoints

The following endpoints require authentication:
- POST `/encrypt`
- POST `/decrypt`
- POST `/encode`
- POST `/rot13`
- POST `/bruteforce`
- POST `/auto-decrypt`

### Public Endpoints

The following endpoints are public (no authentication required):
- GET `/health`
- GET `/info`

---

## Endpoints

| Method | Endpoint      | Description                                    | Status        |
| ------ | ------------- | ---------------------------------------------- | ------------- |
| POST   | /encrypt      | Encrypt text with a given shift                | ✅ Implemented |
| POST   | /decrypt      | Decrypt text with a given shift                | ✅ Implemented |
| POST   | /encode       | Quick encrypt with default shift = 3           | ✅ Implemented |
| POST   | /rot13        | Apply ROT13 encoding (shift = 13)              | ✅ Implemented |
| POST   | /bruteforce   | Show all possible shifts (0–25) for given text | ✅ Implemented |
| POST   | /auto-decrypt | Attempt to auto-detect most likely plaintext   | ✅ Implemented |
| GET    | /health       | Health check endpoint                          | ✅ Implemented |
| GET    | /info         | API metadata and available endpoints           | ✅ Implemented |

---

## Endpoint Details & Examples

### Encrypt (/encrypt)

Encrypt text with a specified shift value (0-25).

**Request:**

```json
{ "text": "Hello, World!", "shift": 3 }
```

**Response:**

```json
{ "encrypted": "Khoor, Zruog!", "shift": 3 }
```

**curl Example:**

```bash
curl -X POST http://localhost:3000/encrypt \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text": "Hello, World!", "shift": 3}'
```

### Decrypt (/decrypt)

Decrypt text with a specified shift value (0-25).

**Request:**

```json
{ "text": "Khoor, Zruog!", "shift": 3 }
```

**Response:**

```json
{ "decrypted": "Hello, World!", "shift": 3 }
```

**curl Example:**

```bash
curl -X POST http://localhost:3000/decrypt \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text": "Khoor, Zruog!", "shift": 3}'
```

### Encode (/encode, default shift=3)

Quick encryption with default shift of 3. Optionally accepts custom shift value.

**Request (default shift):**

```json
{ "text": "Attack at dawn" }
```

**Response:**

```json
{ "encoded": "Dwwdfn dw gdzq", "shift": 3 }
```

**Request (custom shift):**

```json
{ "text": "Attack at dawn", "shift": 5 }
```

**Response:**

```json
{ "encoded": "Fyyfhp fy ifbs", "shift": 5 }
```

**curl Example:**

```bash
# Using default shift (3)
curl -X POST http://localhost:3000/encode \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text": "Attack at dawn"}'

# Using custom shift
curl -X POST http://localhost:3000/encode \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text": "Attack at dawn", "shift": 5}'
```

### ROT13 (/rot13)

Apply ROT13 encoding (fixed shift of 13). ROT13 is symmetric - applying it twice returns the original text.

**Request:**

```json
{ "text": "Hello, World!" }
```

**Response:**

```json
{ "encoded": "Uryyb, Jbeyq!", "shift": 13 }
```

**curl Example:**

```bash
curl -X POST http://localhost:3000/rot13 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text": "Hello, World!"}'

# Verify symmetry - apply ROT13 twice
curl -X POST http://localhost:3000/rot13 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text": "Uryyb, Jbeyq!"}'
```

### Bruteforce (/bruteforce)

Show all possible decryptions (shifts 0-25) for given ciphertext.

**Request:**

```json
{ "text": "Khoor, Zruog!" }
```

**Response:**

```json
{
  "possibilities": {
    "0": "Khoor, Zruog!",
    "1": "Jgnnq, Yqtnf!",
    "2": "Ifmmp, Xpsme!",
    "3": "Hello, World!",
    ...
    "25": "Lipps, Asvph!"
  }
}
```

**curl Example:**

```bash
curl -X POST http://localhost:3000/bruteforce \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text": "Khoor, Zruog!"}'
```

### Auto-Decrypt (/auto-decrypt)

Automatically detect the most likely plaintext using frequency analysis.

**Request:**

```json
{ "text": "Wkh txlfn eurzq ira mxpsv ryhu wkh odcb grj" }
```

**Response:**

```json
{
  "decrypted": "The quick brown fox jumps over the lazy dog",
  "shift": 3
}
```

For ambiguous input, includes `candidates` array:

```json
{
  "decrypted": "most likely text",
  "shift": 5,
  "candidates": [
    { "shift": 5, "text": "most likely text", "score": 8.5 },
    { "shift": 13, "text": "alternative text", "score": 7.2 },
    { "shift": 7, "text": "another option", "score": 6.8 }
  ]
}
```

**curl Example:**

```bash
curl -X POST http://localhost:3000/auto-decrypt \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"text": "Wkh txlfn eurzq ira mxpsv ryhu wkh odcb grj"}'
```

### Info (/info)

Get API metadata and list of available endpoints.

**Response:**

```json
{
  "name": "caesar-cipher-api",
  "version": "1.0.0",
  "description": "Caesar Cipher API built with Bun and Hono",
  "endpoints": [
    { "method": "GET", "path": "/health", "description": "Health check endpoint" },
    { "method": "GET", "path": "/info", "description": "API metadata and available endpoints" },
    ...
  ]
}
```

**curl Example:**

```bash
curl http://localhost:3000/info
```

### Health (/health)

Check if the API is running and healthy.

**Response:**

```json
{ "status": "ok" }
```

**curl Example:**

```bash
curl http://localhost:3000/health
```

---

## Project Structure

```shell
api/
├── src/
│   ├── routes/
│   │   ├── encrypt.ts       # /encrypt endpoint ✅
│   │   ├── decrypt.ts       # /decrypt endpoint ✅
│   │   ├── encode.ts        # /encode (default shift=3) ✅
│   │   ├── rot13.ts         # /rot13 (fixed shift=13) ✅
│   │   ├── health.ts        # /health endpoint ✅
│   │   ├── bruteforce.ts    # /bruteforce endpoint ✅
│   │   ├── autoDecrypt.ts   # /auto-decrypt endpoint ✅
│   │   └── info.ts          # /info endpoint ✅
│   │
│   ├── middleware/
│   │   ├── auth.ts          # Bearer token authentication ✅
│   │   ├── errorHandler.ts  # Structured error handling ✅
│   │   └── logging.ts       # Request logging middleware ✅
│   │
│   ├── repositories/
│   │   └── apiKeyRepository.ts  # API key database access ✅
│   │
│   ├── utils/
│   │   ├── caesar.ts        # Cipher logic ✅
│   │   ├── logger.ts        # Structured logging utility ✅
│   │   └── validation.ts    # Request validation helpers ✅
│   │
│   ├── db.ts                # Database connection pool ✅
│   ├── config.ts            # Environment configuration ✅
│   ├── app.ts               # Hono app setup and route mounting ✅
│   └── server.ts            # Server bootstrap ✅
│
├── db/
│   ├── migrations/          # Database migrations ✅
│   ├── migrate.ts           # Migration runner ✅
│   └── seed.ts              # Database seeding script ✅
│
├── scripts/
│   ├── benchmark.ts         # Performance benchmarks ✅
│   ├── generate-openapi.ts  # OpenAPI spec generator ✅
│   └── ci.sh                # CI validation script ✅
│
├── dist/                    # Production build output
├── openapi.json             # OpenAPI 3.0 specification ✅
├── package.json
├── tsconfig.json
├── biome.json               # Linter configuration ✅
├── bun.lockb
└── .env.local               # Local environment variables (not tracked)
```

**Legend:**

* ✅ Implemented

---

---

## Documentation

For detailed documentation, see the `docs/` directory:

- **[Validation Playbook](docs/VALIDATION_PLAYBOOK.md)** - Step-by-step manual validation procedures
- **[OpenAPI Specification](api/openapi.json)** - API specification for Postman/Swagger
- **[Development Specs](development/caesar-cipher-api/)** - Requirements, design, tasks, and traceability

## Notes

* `shift` must be an integer between 0 and 25.
* Only alphabetic characters are shifted; spaces and punctuation remain unchanged.
* Case is preserved (A → D, a → d).
* `/encode` defaults to shift 3.
* `/rot13` is equivalent to `/encrypt` with shift 13.
