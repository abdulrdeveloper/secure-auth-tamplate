# Privacy Policy

**Last updated: October 27, 2026**

Secure Auth is a free, open-source authentication starter template. This
policy explains what information the Secure Auth demo handles, why it is used,
and the choices available to users.

This document is written for the current implementation and may be updated as
the project grows. It is not a substitute for advice from a qualified legal
professional.

## Who this policy covers

This policy covers the demo hosted by the maintainer.

If you deploy Secure Auth for your own project, you are the operator of that
deployment. You are responsible for your own privacy policy, for the data your
users provide, and for the services you connect. You may adapt this file as a
starting point.

## Information we collect

When you use the demo, we handle:

- **Account information:** your name, email address, a bcrypt hash of your
  password, whether your email is verified, and account timestamps.
- **Verification and reset codes:** 6-digit codes, failed attempt counts and
  resend cooldowns, stored temporarily in Redis.
- **Session information:** an identifier for your current refresh token, stored
  in Redis, and two HttpOnly cookies in your browser.
- **Technical information:** your IP address, used for rate limiting and stored
  temporarily in Redis, and standard request data processed by hosting
  providers.

We never store your password in plain text, and the API never returns your
password hash.

## How we use information

We use information to:

- Create your account and verify your email address.
- Sign you in, keep you signed in and sign you out.
- Send verification and password reset codes by email.
- Protect the service with attempt limits and rate limiting.
- Investigate abuse, troubleshoot problems and improve the project.

We do not sell personal information, show advertising or track you across
other websites.

## Cookies and browser storage

The demo sets two cookies, both HttpOnly so that JavaScript cannot read them:

- `accessToken`, which expires after 15 minutes.
- `refreshToken`, which expires after 7 days.

These cookies are required for signing in. They are not used for analytics or
advertising.

The frontend also stores resend cooldown timers in your browser's
`localStorage`. Each timer contains your email address and an expiry time, and
you can clear it by clearing your browser's site data.

## Service providers

The demo uses third-party infrastructure:

- **MongoDB Atlas** to store accounts.
- **Upstash Redis** to store codes, sessions and rate limit counters.
- **Resend** to deliver emails.
- **Hosting providers** to run the frontend and API.

These providers process information according to their own policies.

## Data retention and deletion

- Verification and reset codes expire after 5 minutes.
- Resend cooldowns expire after 60 seconds.
- Rate limit counters expire after 15 minutes.
- Refresh token records expire after 7 days, or right away when you sign out or
  reset your password.
- Unverified accounts are deleted automatically after 24 hours.
- Verified accounts are kept until you ask us to delete them.

To request a copy, correction or deletion of your account data, follow the
contact steps in [SUPPORT.md](SUPPORT.md). Some information may need to be
kept where required for security, abuse prevention or legal obligations.

## Security

We use reasonable technical measures to protect your information, described
in the [README](README.md). No internet service can guarantee absolute
security. Please report suspected vulnerabilities privately as described in
[SECURITY.md](SECURITY.md).

## Children

The demo is not directed at children. Do not create an account if you are not
legally permitted to do so in your location.

## Changes to this policy

This policy may change when the project, infrastructure or legal requirements
change. The updated version will be published in this file with a revised
date. Continued use after an update means the updated policy applies.

## Contact

For privacy questions or data requests, follow the contact steps in
[SUPPORT.md](SUPPORT.md).
