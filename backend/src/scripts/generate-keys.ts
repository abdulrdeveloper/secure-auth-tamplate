import crypto from "node:crypto";
import fs from "node:fs";

const { privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

const envLines = `OIDC_PRIVATE_KEY="${privateKey.replace(/\n/g, "\\n")}"\nOIDC_KEY_ID="clavis-key-v1"\n`;

fs.writeFileSync(".keys", envLines, { mode: 0o600 });
console.log("Key saved to .keys. Copy its contents into .env, then delete .keys.");
