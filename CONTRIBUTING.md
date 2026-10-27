# Contributing to Secure Auth

Thanks for helping make Secure Auth better. This guide explains how to set up
the project, how we work, and what a good pull request looks like.

By participating you agree to follow our [Code of Conduct](CODE_OF_CONDUCT.md).
Contributions are released under the project's [MIT License](LICENSE).

## Ways to contribute

- Report a bug or suggest a feature by opening an issue.
- Improve documentation or fix typos.
- Pick up an open issue.
- Review open pull requests.

For anything security related, do **not** open a public issue. See
[SECURITY.md](SECURITY.md).

## Development setup

Requirements: Node.js 24 and pnpm 11 (`corepack enable` sets up pnpm). You also
need a MongoDB database, an Upstash Redis database and a Resend API key. The
[README](README.md) explains where to get each one.

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

Never commit `.env` files.

## Workflow

1. **Open or find an issue first** for anything bigger than a small fix, so we
   can agree on the approach before you spend time on it.
2. **Fork** the repository and create a branch from `main`. Nobody pushes
   directly to `main`; every change goes through a pull request.
3. Use a descriptive branch name: `feat/short-name`, `fix/short-name`,
   `docs/short-name`, `chore/short-name`.
4. Keep the change focused. One pull request should do one thing.
5. Run the checks below and make sure they pass.
6. Open a pull request against `main`.

## Checks

```bash
cd backend
pnpm type-check
pnpm build

cd ../frontend
pnpm build
```

There is no automated test suite yet. Describe in the pull request how you
tested your change, for example the auth flows you ran by hand.

## Commit messages

Write short, imperative messages that explain the change, for example
`Fix cooldown when resending a reset code`. We use
[Conventional Commits](https://www.conventionalcommits.org/) prefixes
(`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`).

## Pull request checklist

- [ ] The change is focused and the description explains *why*.
- [ ] Backend `type-check` and `build` pass, and the frontend `build` passes.
- [ ] You describe how you tested the change.
- [ ] Docs are updated if behaviour, configuration or setup changed.
- [ ] No secrets, personal data or `.env` files are included.
- [ ] UI changes include a screenshot.

## Code style

- TypeScript in strict mode. Avoid `any`.
- Follow the existing structure and patterns in `backend/src` and `frontend/src`.
- Put timings and limits in `backend/src/config/auth.config.ts`, not inline.
- Validate input on the server with Zod; never trust the client.
- Keep forms accessible: labels, keyboard support and sufficient contrast.
- Keep the template minimal. New features should be useful to most projects
  that start from it.

## Review

A maintainer will review your pull request as soon as they can. Please be
patient and responsive to feedback. Maintainers may ask for changes, or close a
pull request that is out of scope; this is never personal.

## Questions

Open an issue, or see [SUPPORT.md](SUPPORT.md).
