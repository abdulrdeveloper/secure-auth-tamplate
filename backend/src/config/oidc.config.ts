export const OIDC_CONFIG = {
  issuer: process.env.ISSUER_URL || "http://localhost:3000",
  supportedScopes: ["openid", "profile", "email"],
  responseTypes: ["code"],
  subjectTypes: ["public"],
  tokenSigningAlgorithm: "RS256",
  authCodeTTL: 120,
  idTokenTTL: 3600,
  accessTokenTTL: 3600,
  tokenEndpointAuthMethods: ["client_secret_post", "client_secret_basic"],
  supportedClaims: [
    "sub",
    "name",
    "email",
    "email_verified",
    "iat",
    "exp",
    "aud",
    "iss",
  ],
  grantTypes: ["authorization_code"],
} as const;

export const getEndpointUrls = () => {
  const base = OIDC_CONFIG.issuer;
  return {
    authorization: `${base}/oauth/authorize`,
    token: `${base}/oauth/token`,
    userinfo: `${base}/oauth/userinfo`,
    jwks: `${base}/.well-known/jwks.json`,
    discovery: `${base}/.well-known/openid-configuration`,
  };
};

export const getDiscoveryDocument = () => {
  const endpoints = getEndpointUrls();
  
  return {
    issuer: OIDC_CONFIG.issuer,
    authorization_endpoint: endpoints.authorization,
    token_endpoint: endpoints.token,
    userinfo_endpoint: endpoints.userinfo,
    jwks_uri: endpoints.jwks,
    response_types_supported: OIDC_CONFIG.responseTypes,
    subject_types_supported: OIDC_CONFIG.subjectTypes,
    id_token_signing_alg_values_supported: [OIDC_CONFIG.tokenSigningAlgorithm],
    scopes_supported: OIDC_CONFIG.supportedScopes,
    token_endpoint_auth_methods_supported: OIDC_CONFIG.tokenEndpointAuthMethods,
    claims_supported: OIDC_CONFIG.supportedClaims,
    grant_types_supported: OIDC_CONFIG.grantTypes,
    code_challenge_methods_supported: ["S256"],
  };
};
