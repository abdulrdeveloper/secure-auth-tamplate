/**
 * RSA Key Management Service
 * Handles keypair generation, loading, and JWK export for RS256 JWT signing
 */

import crypto from "node:crypto";

const KEY_ID = process.env.OIDC_KEY_ID || "myauth-key-v1";

let privateKey: string | null = null;
let publicKey: string | null = null;

export const generateKeyPair = (): {
  privateKey: string;
  publicKey: string;
} => {
  const { privateKey: privKey, publicKey: pubKey } =
    crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });

  return { privateKey: privKey, publicKey: pubKey };
};

export const loadKeyPair = () => {
  const envPrivateKey = process.env.OIDC_PRIVATE_KEY;
  const envPublicKey = process.env.OIDC_PUBLIC_KEY;

  if (envPrivateKey && envPublicKey) {
    privateKey = envPrivateKey.replace(/\\n/g, "\n");
    publicKey = envPublicKey.replace(/\\n/g, "\n");
    console.log("Loaded RSA keypair from environment");
    return;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "OIDC_PRIVATE_KEY and OIDC_PUBLIC_KEY must be set in production"
    );
  }

  console.warn("WARNING: Generating temporary RSA keypair for development");
  console.warn("For production, generate keys securely and add to environment variables");
  
  const { privateKey: newPrivKey, publicKey: newPubKey } = generateKeyPair();
  privateKey = newPrivKey;
  publicKey = newPubKey;
};

export const getPrivateKey = (): string => {
  if (!privateKey) {
    throw new Error("Private key not loaded. Call loadKeyPair() first.");
  }
  return privateKey;
};

export const getPublicKey = (): string => {
  if (!publicKey) {
    throw new Error("Public key not loaded. Call loadKeyPair() first.");
  }
  return publicKey;
};

export const getKeyId = (): string => {
  return KEY_ID;
};

export const getPublicKeyJWK = (): {
  kty: string;
  use: string;
  alg: string;
  kid: string;
  n: string;
  e: string;
} => {
  const pubKey = getPublicKey();
  const keyObject = crypto.createPublicKey(pubKey);
  const jwk = keyObject.export({ format: "jwk" }) as {
    kty: string;
    n: string;
    e: string;
  };

  return {
    kty: jwk.kty,
    use: "sig",
    alg: "RS256",
    kid: KEY_ID,
    n: jwk.n,
    e: jwk.e,
  };
};

export const getJWKS = () => {
  return {
    keys: [getPublicKeyJWK()],
  };
};

export const verifyKeyPair = (): boolean => {
  try {
    const testData = "test-verification";
    
    const sign = crypto.createSign("RSA-SHA256");
    sign.update(testData);
    const signature = sign.sign(getPrivateKey(), "base64");

    const verify = crypto.createVerify("RSA-SHA256");
    verify.update(testData);
    const isValid = verify.verify(getPublicKey(), signature, "base64");

    if (!isValid) {
      console.error("RSA keypair verification failed");
    }

    return isValid;
  } catch (error) {
    console.error("Error verifying RSA keypair");
    return false;
  }
};

export const initializeKeyService = () => {
  console.log("Initializing RSA key service");
  loadKeyPair();
  
  if (!verifyKeyPair()) {
    throw new Error("RSA keypair verification failed");
  }
  
  console.log(`Key service ready (kid: ${KEY_ID})`);
};
