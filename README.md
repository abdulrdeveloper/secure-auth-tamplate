<p align="center">
  <img src="frontend/public/logo-mark.png" alt="Clavis" height="120" />
</p>

<h3 align="center">Open-source identity for your apps: sign-up, sign-in, and OpenID Connect, self-hosted.</h3>

<p align="center">
  Clavis is an open-source identity platform, built in the same spirit as Clerk. Users sign up, verify their email and sign in once. Your other apps then receive standard OpenID Connect tokens. You run it on your own infrastructure with MongoDB, Redis and Resend.
</p>

<p align="center">
  <a href="LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/license-MIT-blue.svg" /></a>
  <img alt="Express 5" src="https://img.shields.io/badge/Express-5-black.svg" />
  <img alt="React 18" src="https://img.shields.io/badge/React-18-61dafb.svg" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178c6.svg" />
  <a href="CONTRIBUTING.md"><img alt="PRs welcome" src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" /></a>
</p>

---

## What is Clavis?

Almost every SaaS, dashboard or side project needs the same thing first: a safe
way for people to sign up and sign in. Building it properly takes days, and small
mistakes (tokens in `localStorage`, unlimited OTP guesses, leaking stack traces)
turn into real security problems.

Clavis covers the parts that are easy to get wrong, already built and tested:

- **Backend:** Express 5, TypeScript, MongoDB (Mongoose), Upstash Redis and Resend.
- **Frontend:** React 18, Vite and Tailwind CSS v4.
- **Sessions:** a short-lived access token and a rotating refresh token, both in
  HttpOnly cookies that JavaScript cannot read.

It is focused on a few things done well: email and password accounts, a hosted-style sign-in UI, and an OpenID Connect provider for your other apps. Social login and an admin dashboard are not included yet.

## Features

### Sign up and verify
- Register with name, email and password.
- A 6-digit code is emailed through Resend and expires after 5 minutes.
- Resend the code with a cooldown, and get signed in automatically after
  verifying.
- Unverified accounts are deleted automatically after 24 hours.

### Sign in and stay signed in
- 15 minute access token and 7 day refresh token, both HttpOnly cookies.
- The refresh token rotates on every use, and an old one is rejected.
- The frontend refreshes the session silently. Five requests failing at once
  still trigger only one refresh.
- Each device gets its own session. Signing in on a phone does not sign out
  the laptop.
- Logout ends only this device's session, and the device loses access at once.

### Recover an account
- Forgot password sends a separate reset code.
- Resetting the password signs out every device.

### Protected by default
- Wrong OTP guesses are limited to 5 per code, even when sent in parallel.
- IP rate limiting on login, register, OTP and email routes.
- Passwords hashed with bcrypt and never returned by the API.
- Generic responses on forgot password and resend, so the API does not reveal
  which emails have accounts.
- A central error handler returns clean JSON and never leaks stack traces.
- The server refuses to start if a required environment variable is missing,
  or if the access and refresh secrets are the same.

### Ready for your app
- `ProtectedRoute` and `PublicRoute` wrappers, plus a `useAuth()` hook with the
  current user.
- After login, users return to the page they were trying to open.
- The dashboard lists every signed-in device (browser, system, IP, last
  active). One click and a confirmation sign a device out immediately.
- Connected apps: users see every app they signed in to with Clavis and can
  remove one. Its access token stops working at once and it must ask again.
  Consent is asked once per app, not on every sign-in.
- A Developers page (`/developers`) to register apps, copy the client ID, see
  the secret once, and delete apps.
- Every timing and limit lives in one config file.
- Responsive layout with labelled, keyboard-friendly forms.

## How it works

1. **Register:** the user signs up and receives a verification code by email.
2. **Verify:** the code is checked against Redis, the account is marked verified,
   and the user is signed in.
3. **Use the app:** every request carries the access cookie. When it expires,
   the frontend calls `/api/auth/refresh` once and retries the request.
4. **Sign out:** the refresh token is deleted from Redis and both cookies are
   cleared.

## Run it yourself

### You need

- **Node.js 24** and **pnpm 11** (`corepack enable` sets up pnpm)
- A **MongoDB** database ([Atlas free tier](https://www.mongodb.com/cloud/atlas/register)
  or a local `mongodb://127.0.0.1:27017/secure-auth`)
- An **Upstash Redis** database ([free tier](https://upstash.com/)), using the
  REST URL and token
- A **Resend** API key ([free tier](https://resend.com/)) and a sender address
  on a domain verified in Resend

### Quick start

```bash
git clone https://github.com/abdulrdeveloper/secure-auth-tamplate.git
cd secure-auth-tamplate

cd backend
pnpm install
cp .env.example .env
pnpm dev
```

In a second terminal:

```bash
cd frontend
pnpm install
cp .env.example .env
pnpm dev
```

Open **http://localhost:5173**. The API runs on **http://localhost:3000**.

Generate the two token secrets with this command, once for each. They must be
different:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Configuration

Backend (`backend/.env`):

| Variable | Required | What it is |
| --- | --- | --- |
| `PORT` | No | API port, default `3000` |
| `NODE_ENV` | Yes in production | Set to `production` to enable Secure cookies |
| `FRONTEND_URL` | Yes | Allowed frontend origin for CORS, comma-separated for several |
| `COOKIE_SAMESITE` | Yes | `lax` when frontend and API share a site, `none` when they are on different sites |
| `MONGO_URI` | Yes | MongoDB connection string |
| `ACCESS_TOKEN_SECRET` | Yes | Secret for access tokens |
| `REFRESH_TOKEN_SECRET` | Yes | Secret for refresh tokens, different from the access secret |
| `RESEND_API_KEY` | Yes | Resend API key |
| `EMAIL_FROM` | Yes | Sender address on your verified Resend domain |
| `APP_NAME` | No | Sender name shown in emails |
| `UPSTASH_REDIS_REST_URL` | Yes | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Yes | Upstash Redis REST token |

Frontend (`frontend/.env`):

| Variable | Required | What it is |
| --- | --- | --- |
| `VITE_API_URL` | Yes in production | Backend URL, default `http://localhost:3000` |

Never commit `.env` files. Both folders include a `.env.example`.

### Make it yours

| What | Where |
| --- | --- |
| Token lifetimes, OTP timings, password length, rate limits | `backend/src/config/auth.config.ts` |
| Brand name, tagline and repository links | `frontend/src/config/site.ts` |
| Email design and wording | `backend/src/services/mail.service.ts` |
| Page title and favicon | `frontend/index.html`, `frontend/public/logo-mark.png` |
| New protected pages | Add a `<Route>` inside `<ProtectedRoute>` in `frontend/src/App.tsx` |

### Deploy

The template is set up for **Heroku** (backend) and **Vercel** (frontend), and
works on any Node.js host.

**Backend on Heroku**
- `backend/Procfile` runs `node dist/server.js`.
- The app lives in a subfolder, so push it with
  `git subtree push --prefix backend heroku main`.
- Add every backend variable as a Config Var, with `NODE_ENV=production`.

**Frontend on Vercel**
- Set the Root Directory to `frontend` and add `VITE_API_URL`.
- `frontend/vercel.json` rewrites all routes to `index.html`.

**Cookies across domains**

Some browsers, Safari in particular, block cookies sent between different
sites. Put the API on a subdomain of the frontend's domain, for example
`app.example.com` and `api.example.com`, and set `COOKIE_SAMESITE=lax`. Use
`none` only when that is not possible.

## API

All routes are under `/api/auth`.

| Method | Route | What it does |
| --- | --- | --- |
| `POST` | `/register` | Create an account and send a verification code |
| `POST` | `/verify-email` | Verify the code and sign in |
| `POST` | `/resend-otp` | Send a new verification code |
| `POST` | `/login` | Sign in with email and password |
| `POST` | `/refresh` | Rotate the refresh token and issue a new access token |
| `GET` | `/me` | Return the signed-in user |
| `POST` | `/logout` | End this device's session and clear cookies |
| `GET` | `/sessions` | List the signed-in devices, this one first |
| `DELETE` | `/sessions/:id` | Sign a device out immediately |
| `POST` | `/forgot-password` | Send a password reset code |
| `POST` | `/verify-reset-otp` | Check a reset code |
| `POST` | `/reset-password` | Set a new password and sign out every device |

`GET /health` returns `{ "status": "ok" }` for uptime checks.

## Tech stack

| Area | Tools |
| --- | --- |
| API | Express 5, TypeScript, Zod |
| Data | MongoDB with Mongoose, Upstash Redis |
| Auth | JSON Web Tokens, bcrypt, HttpOnly cookies |
| Email | Resend |
| UI | React 18, React Router 7, Vite, Tailwind CSS 4, Lucide icons |
| Tooling | pnpm |

## Useful commands

| Folder | Command | What it does |
| --- | --- | --- |
| `backend` | `pnpm dev` | Compile in watch mode and run the API |
| `backend` | `pnpm build` / `pnpm start` | Production build and server |
| `backend` | `pnpm type-check` | TypeScript check |
| `frontend` | `pnpm dev` | Start the Vite dev server |
| `frontend` | `pnpm build` / `pnpm preview` | Production build and local preview |

## Project layout

```text
backend/
  server.ts              Startup, env checks, database connection
  src/config/            Auth settings, cookies, validation schemas, database
  src/controllers/       One file per auth route
  src/middlewares/       Auth, validation, rate limit and error handling
  src/services/          OTP, email and Redis
  src/utils/             Tokens and the public user object
  src/models/            Mongoose user model
frontend/
  src/pages/             Auth pages and the dashboard
  src/components/        Layout, form fields and route guards
  src/context/           AuthProvider and useAuth
  src/lib/               API client with silent refresh
  src/config/            Site branding
```

## Project status

The full flow, from registration to logout, is tested end to end against real
MongoDB and Upstash, in the API and in a headless browser.

One limitation is intentional, to keep the template simple:

- **Unverified email squatting.** If someone registers another person's email
  and never verifies it, the real owner can still register, or recover the
  account with forgot password.

There are no automated tests in the repository yet.

## Use it as a login provider for other sites (OpenID Connect)

The backend is an OpenID Connect provider. Any site can use it for login with a
standard OIDC library (for example `openid-client`, Auth.js / NextAuth, or Passport).

**Environment variables**

| Variable | Purpose |
|---|---|
| `ISSUER_URL` | Public URL of the backend, for example `https://auth.example.com`. Required in production. |
| `OIDC_PRIVATE_KEY` | RSA private key used to sign tokens. Generate it with `pnpm generate:keys`. |
| `OIDC_KEY_ID` | Key id placed in the token header, for example `clavis-key-v1`. |

**Endpoints**

| Endpoint | Purpose |
|---|---|
| `GET /.well-known/openid-configuration` | Discovery document. Most libraries only need this URL. |
| `GET /.well-known/jwks.json` | Public key for verifying tokens. |
| `GET /oauth/authorize` | Starts login. Signs the user in and asks for consent if needed. |
| `POST /oauth/token` | Exchanges the code for `id_token` and `access_token`. |
| `GET /oauth/userinfo` | Returns the user's profile for a Bearer access token. |

**Register a site (client)**

- Your own sites (no consent screen), from `backend/`:
  ```bash
  pnpm run new-client "My Site" https://mysite.com/auth/callback
  ```
  Add `--untrusted` to show the consent screen instead.
- Other people's sites: a signed-in user opens **Developers** (`/developers`) and clicks
  **New app**, or calls `POST /api/oauth/clients` with `name` and `redirectUris`.
  Users see a consent screen the first time they sign in to these apps.

The client secret is shown only once, when the client is created.

**Connected apps** (signed-in user, under `/api/oauth`)

| Method | Route | What it does |
| --- | --- | --- |
| `GET` | `/grants` | Apps this user has allowed, with scopes and last use |
| `DELETE` | `/grants/:clientId` | Remove an app. Its access token stops working at once |

**Flow**

1. Send the user to `/oauth/authorize?response_type=code&client_id=...&redirect_uri=...&scope=openid%20profile%20email&state=...&nonce=...&code_challenge=...&code_challenge_method=S256`.
2. The user comes back to `redirect_uri?code=...&state=...`.
3. Your server posts `grant_type=authorization_code`, `code`, `redirect_uri` and `code_verifier`
   to `/oauth/token` as a form, with the client id and secret in a Basic auth header.
4. Verify the `id_token` with the JWKS, or call `/oauth/userinfo` with the access token.

## Contributing

Contributions are welcome, from typo fixes to new features. Please read
[CONTRIBUTING.md](CONTRIBUTING.md) and follow our
[Code of Conduct](CODE_OF_CONDUCT.md). Every change goes through a pull request.

Need help? See [SUPPORT.md](SUPPORT.md).

## Security

Found a vulnerability? Please report it privately as described in
[SECURITY.md](SECURITY.md) instead of opening a public issue.

## Policies

- [Privacy Policy](PRIVACY.md)
- [Terms of Use](TERMS.md)

## License

Released under the [MIT License](LICENSE). Copyright (c) 2026 Abdul Rahman.
