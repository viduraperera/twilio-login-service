# twilio-auth-service

A small **Express** + **Twilio Verify** service that sends one-time passcodes (OTP) to a phone number and verifies them. On successful verification, it issues a **JWT** token.

## 🚀 What it does

- **`POST /api/auth/send-otp`** — sends an SMS OTP to a phone number using Twilio Verify
- **`POST /api/auth/verify-otp`** — checks the OTP and returns a JWT when approved

## 📁 Project structure

- `src/app.ts` — Express app setup (CORS + JSON parsing + routes)
- `src/server.ts` — starts the HTTP server
- `src/config/env.ts` — loads environment variables
- `src/modules/auth/` — auth feature (routes, controller, service)
- `src/modules/auth/utils/twilio.client.ts` — Twilio client wrapper

## ✅ Prerequisites

- Node.js / Bun (this repo currently uses **Bun** for running)
- A [Twilio](https://www.twilio.com) account with a **Verify Service** configured

## ⚙️ Setup

1. Copy `.env` from the template (or create your own):

```bash
cp .env.example .env
```

2. Fill in your Twilio credentials and a JWT secret:

```env
PORT=5000
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxxx
TWILIO_VERIFY_SERVICE_ID=VAXXX
JWT_SECRET=your_jwt_secret
```

3. Install dependencies:

```bash
bun install
```

4. Run the server:

```bash
bun run index.ts
```

The server will listen on `http://localhost:5000` (or your configured `PORT`).

## 🧠 How it works

### Send OTP

`POST /api/auth/send-otp` expects JSON:

```json
{ "phone": "+15555551234" }
```

It calls Twilio Verify to send an SMS OTP to that phone number.

### Verify OTP

`POST /api/auth/verify-otp` expects JSON:

```json
{ "phone": "+15555551234", "code": "123456" }
```

If verification succeeds, it returns a JWT token:

```json
{ "success": true, "token": "..." }
```

## 🧩 Notes

- JWTs are signed using `JWT_SECRET` and expire in 1 hour.
- If verification fails, the service returns a `400` with an error message.

---

If you want to extend this service, add new routes under `src/modules/` and mount them in `src/app.ts`.
