import crypto, { type KeyObject } from "node:crypto";

const KEY_ID = process.env.OIDC_KEY_ID || "clavis-key-v1";

let privateKey: KeyObject;
let publicKey: KeyObject;
let jwks: { keys: object[] };

export function initializeKeyService() {
  const pem = process.env.OIDC_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (pem) {
    privateKey = crypto.createPrivateKey(pem);
  } else {
    console.warn("OIDC_PRIVATE_KEY is not set, using a temporary development key");
    privateKey = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 }).privateKey;
  }

  publicKey = crypto.createPublicKey(privateKey);
  jwks = {
    keys: [{ ...publicKey.export({ format: "jwk" }), use: "sig", alg: "RS256", kid: KEY_ID }],
  };
}

export const getPrivateKey = () => privateKey;
export const getPublicKey = () => publicKey;
export const getKeyId = () => KEY_ID;
export const getJwks = () => jwks;
