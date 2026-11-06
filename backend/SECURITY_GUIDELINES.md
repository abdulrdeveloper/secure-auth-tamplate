# Security Guidelines

## Key Management

### DO NOT:
- ❌ Log private keys to console (even in development)
- ❌ Commit private keys to git
- ❌ Store private keys in plaintext files
- ❌ Share private keys via chat/email
- ❌ Use the same keys across environments

### DO:
- ✅ Generate keys using `pnpm generate:keys`
- ✅ Store keys in environment variables only
- ✅ Use different keys for dev/staging/prod
- ✅ Rotate keys periodically
- ✅ Set file permissions to 0600 for key files

## Production Deployment

### Required Environment Variables:
```bash
OIDC_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
OIDC_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
OIDC_KEY_ID="unique-key-identifier"
ISSUER_URL="https://yourdomain.com"
NODE_ENV="production"
```

### Key Generation:
```bash
cd backend
pnpm generate:keys
# Keys saved to .keys file (gitignored)
# Copy to .env and delete .keys file immediately
```

## Error Handling

- Never log error objects that might contain sensitive data
- Use generic error messages in API responses
- Log errors internally without exposing details to clients

## Rate Limiting

- OIDC discovery endpoints are cached (1 hour)
- OAuth endpoints will have rate limiting (Phase 3)

## Security Headers

- CORS configured for discovery endpoints
- Cache-Control set appropriately
- Future: Add CSP, HSTS in production
