# Security Policy

Secure Auth handles passwords, email verification codes and session tokens, so
we take security reports seriously.

## Supported versions

Only the latest commit on `main` is supported. Fixes are not back-ported.

## Reporting a vulnerability

**Please do not open a public issue, discussion or pull request for security
problems.**

Report privately using GitHub's
[private vulnerability reporting](../../security/advisories/new)
(Security tab, then *Report a vulnerability*) on this repository.

Please include:

- A description of the issue and its impact.
- Steps to reproduce, or a proof of concept.
- The affected route, file or commit if you know it.
- Any suggested fix.

## What to expect

- We aim to acknowledge your report within **3 business days**.
- We aim to share an assessment and plan within **10 business days**.
- We will keep you updated, and credit you in the fix unless you prefer to stay
  anonymous.

## Scope

In scope:

- Registration, email verification and password reset.
- Access and refresh token handling, rotation and revocation.
- Cookie settings, CORS and session handling.
- OTP attempt limits, cooldowns and rate limiting.
- Input validation and error responses.

Out of scope:

- Social engineering and phishing.
- Denial of service by volume.
- Issues in third-party services (MongoDB Atlas, Upstash, Resend, hosting
  providers).
- Findings that require a compromised device or an already compromised account.
- Insecure configuration of a deployment, for example weak secrets or a
  committed `.env` file.
- The two intentional limitations listed in the README: one session per user,
  and unverified email squatting.

## Good-faith research

If you act in good faith, avoid accessing other users' data, and give us
reasonable time to fix the issue before disclosure, we will not pursue action
against you.

## If you deploy this template

- Generate long random values for `ACCESS_TOKEN_SECRET` and
  `REFRESH_TOKEN_SECRET`, and keep them different.
- Set `NODE_ENV=production` so cookies are sent only over HTTPS.
- Set `FRONTEND_URL` to your real frontend origin only.
- Keep dependencies up to date.

## For contributors

- Never commit secrets (`.env` files, API keys, database URIs, token secrets).
- If you accidentally commit a secret, tell a maintainer immediately so it can
  be rotated. Removing it in a later commit does not make it safe.
