import "dotenv/config";
import mongoose from "mongoose";
import { createClient } from "../services/oauth-client.service.js";

const args = process.argv.slice(2);
const isTrusted = !args.includes("--untrusted");
const [name, ...redirectUris] = args.filter((arg) => arg !== "--untrusted");

const isValidUrl = (value: string) => URL.canParse(value) && !new URL(value).hash;

if (!name || redirectUris.length === 0 || !redirectUris.every(isValidUrl)) {
  console.error('Usage: pnpm run new-client "<app name>" <redirect_uri> [more redirect_uris] [--untrusted]');
  process.exit(1);
}

await mongoose.connect(process.env.MONGO_URI as string);

const { client, clientSecret } = await createClient({ name, redirectUris, isTrusted });

console.log(`Created ${client.name} (${isTrusted ? "trusted, no consent screen" : "shows consent screen"})`);
console.log(`  Client ID:     ${client.clientId}`);
console.log(`  Client Secret: ${clientSecret}`);
console.log(`  Redirect URIs: ${client.redirectUris.join(", ")}`);
console.log("Save the secret now. It cannot be shown again.");

await mongoose.disconnect();
