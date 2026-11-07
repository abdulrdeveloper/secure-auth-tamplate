const issuer = (process.env.ISSUER_URL || "http://localhost:3000").replace(/\/+$/, "");

export const OIDC_CONFIG = {
  issuer,
  supportedScopes: ["openid", "profile", "email"],
  authCodeTTL: 120,
  idTokenTTL: 3600,
  accessTokenTTL: 3600,
} as const;

export const DISCOVERY_DOCUMENT = {
  issuer,
  authorization_endpoint: `${issuer}/oauth/authorize`,
  token_endpoint: `${issuer}/oauth/token`,
  userinfo_endpoint: `${issuer}/oauth/userinfo`,
  jwks_uri: `${issuer}/.well-known/jwks.json`,
  response_types_supported: ["code"],
  subject_types_supported: ["public"],
  id_token_signing_alg_values_supported: ["RS256"],
  scopes_supported: OIDC_CONFIG.supportedScopes,
  token_endpoint_auth_methods_supported: ["client_secret_basic", "client_secret_post"],
  claims_supported: ["sub", "name", "email", "email_verified", "nonce", "iss", "aud", "exp", "iat"],
  grant_types_supported: ["authorization_code"],
  code_challenge_methods_supported: ["S256"],
};
