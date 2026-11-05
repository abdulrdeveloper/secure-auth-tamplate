/**
 * Secure RSA Key Generation Script
 * Run: pnpm tsx src/scripts/generate-keys.ts
 * 
 * Keys are written to a .keys file (gitignored) and NOT logged to console
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
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

const envContent = `# Add these to your .env file (DO NOT COMMIT)
OIDC_PRIVATE_KEY="${privateKey.replace(/\n/g, "\\n")}"
OIDC_PUBLIC_KEY="${publicKey.replace(/\n/g, "\\n")}"
OIDC_KEY_ID="myauth-key-v1"
`;

const outputPath = path.join(process.cwd(), ".keys");
fs.writeFileSync(outputPath, envContent, { mode: 0o600 });

console.log(`Keys generated and saved to ${outputPath}`);
console.log("Copy the contents to your .env file");
console.log("Delete .keys file after copying");
