# Support

Secure Auth is an independent open-source project. If something is unclear or
does not work as expected, help is available.

## Before asking for help

Please check:

- The setup, configuration and deployment steps in [README.md](README.md).
- [CONTRIBUTING.md](CONTRIBUTING.md) for contribution and pull request guidance.
- [SECURITY.md](SECURITY.md) for security vulnerabilities. Do not post them
  publicly.
- Existing [issues](../../issues), in case someone already asked.

## Common setup problems

- **The server exits at startup:** the console names the missing or invalid
  environment variable. Compare your `.env` with `.env.example`.
- **No verification email arrives:** check that `EMAIL_FROM` uses a domain
  verified in Resend, and check your spam folder.
- **Login works but you are signed out right away:** your browser is blocking
  the cookies. Check `FRONTEND_URL`, `COOKIE_SAMESITE` and the "Cookies across
  domains" section of the README.
- **CORS errors in the browser:** `FRONTEND_URL` must exactly match the
  frontend origin, including the protocol and port.
- **"Too many requests":** the rate limit window is 15 minutes. Wait, or adjust
  the limits in `backend/src/config/auth.config.ts` for local development.

## How to get help

Open an [issue](../../issues/new) and include:

- A short description of the problem.
- Steps to reproduce it.
- What you expected to happen and what happened instead.
- Your Node.js and pnpm versions, operating system and browser.
- Error messages or screenshots.

Remove passwords, tokens, API keys, database URIs and personal data before you
post anything. Never share your `.env` file.

For privacy or data requests about the demo, open an issue that says you have a
data request, without including personal details. The maintainer will reply
with a private way to continue.

## Response expectations

Support is handled as capacity allows and does not guarantee an immediate
response. Security reports follow the timelines in [SECURITY.md](SECURITY.md).

## Feature requests

Feature ideas are welcome. Strong requests explain the problem, who benefits,
and the proposed outcome. Secure Auth stays deliberately minimal, so requests
are weighed against security, simplicity and maintenance cost.

## Your own deployment

If you deployed Secure Auth for your own project, you are responsible for
supporting your users. The maintainer can help with the template itself, but
not with your hosting, data or users.
