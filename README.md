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

### Run the server

```shell
bun run dev
```

Server will start at:
[http://localhost:3000](http://localhost:3000)

---

## Endpoints

| Method | Endpoint      | Description                                    |
| ------ | ------------- | ---------------------------------------------- |
| POST   | /encrypt      | Encrypt text with a given shift                |
| POST   | /decrypt      | Decrypt text with a given shift                |
| POST   | /encode       | Quick encrypt with default shift = 3           |
| POST   | /rot13        | Apply ROT13 encoding (shift = 13)              |
| POST   | /bruteforce   | Show all possible shifts (0–25) for given text |
| POST   | /auto-decrypt | Attempt to auto-detect most likely plaintext   |
| GET    | /health       | Health check endpoint                          |
| GET    | /info         | API metadata and available endpoints           |

---

## Endpoint Details & Examples

### Encrypt (/encrypt)

Request:

```json
{ "text": "hello world", "shift": 3 }
```

Response:

```json
{ "encrypted": "khoor zruog", "shift": 3 }
```

### Decrypt (/decrypt)

Request:

```json
{ "text": "khoor zruog", "shift": 3 }
```

Response:

```json
{ "decrypted": "hello world", "shift": 3 }
```

### Encode (/encode, default shift=3)

Request:

```json
{ "text": "attack at dawn" }
```

Response:

```json
{ "encrypted": "dwwdfn dw gdzq", "shift": 3 }
```

### ROT13 (/rot13)

Request:

```json
{ "text": "hello world" }
```

Response:

```json
{ "rot13": "uryyb jbeyq" }
```

### Bruteforce (/bruteforce)

Request:

```json
{ "text": "khoor" }
```

Response (partial):

```json
{
  "possibilities": {
    "1": "jgnnq",
    "2": "ifmmp",
    "3": "hello",
    "4": "gdkkn",
    "...": "..."
  }
}
```

### Auto-Decrypt (/auto-decrypt)

Request:

```json
{ "text": "khoor zruog" }
```

Response:

```json
{ "decrypted": "hello world", "shift": 3 }
```

### Health (/health)

Response:

```json
{ "status": "ok" }
```

### Info (/info)

Response:

```json
{
  "name": "Caesar Cipher API",
  "version": "1.0.0",
  "endpoints": [
    "/encrypt",
    "/decrypt",
    "/encode",
    "/rot13",
    "/bruteforce",
    "/auto-decrypt",
    "/health",
    "/info"
  ]
}
```

---

## Project Structure

```shell
api/
├── src/
│   ├── routes/
│   │   ├── encrypt.ts       # /encrypt endpoint
│   │   ├── decrypt.ts       # /decrypt endpoint
│   │   ├── encode.ts        # /encode (default shift=3)
│   │   ├── rot13.ts         # /rot13 (fixed shift=13)
│   │   ├── bruteforce.ts    # /bruteforce endpoint
│   │   ├── autoDecrypt.ts   # /auto-decrypt endpoint
│   │   ├── health.ts        # /health endpoint
│   │   └── info.ts          # /info endpoint
│   │
│   ├── utils/
│   │   └── caesar.ts        # Cipher logic: shift, encrypt, decrypt, bruteforce
│   │
│   ├── app.ts               # Hono app setup and route mounting
│   └── server.ts            # Server bootstrap (start server on port)
│
├── package.json
├── bun.lockb
└── README.md
```

---

## Notes

* `shift` must be an integer between 0 and 25.
* Only alphabetic characters are shifted; spaces and punctuation remain unchanged.
* Case is preserved (A → D, a → d).
* `/encode` defaults to shift 3.
* `/rot13` is equivalent to `/encrypt` with shift 13.
