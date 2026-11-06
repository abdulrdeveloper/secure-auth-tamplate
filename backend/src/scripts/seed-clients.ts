import "dotenv/config";
import mongoose from "mongoose";
import { createClient } from "../services/oauth-client.service.js";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI not set in environment");
  process.exit(1);
}

const clients = [
  {
    name: "Glimpse",
    redirectUris: [
      "http://localhost:3001/auth/callback",
      "http://localhost:3001/api/auth/callback",
    ],
    allowedScopes: ["openid", "profile", "email"],
    isTrusted: true,
    description: "Glimpse application",
  },
  {
    name: "Sonic",
    redirectUris: [
      "http://localhost:4000/auth/callback",
      "http://localhost:4000/api/auth/callback",
    ],
    allowedScopes: ["openid", "profile", "email"],
    isTrusted: true,
    description: "Sonic application",
  },
];

async function seedClients() {
  try {
    await mongoose.connect(MONGO_URI!);
    console.log("Connected to MongoDB");

    for (const clientData of clients) {
      const { client, clientSecret } = await createClient(clientData);
      console.log(`\n✓ Created client: ${client.name}`);
      console.log(`  Client ID: ${client.clientId}`);
      console.log(`  Client Secret: ${clientSecret}`);
      console.log(`  Redirect URIs: ${client.redirectUris.join(", ")}`);
    }

    console.log("\n✓ Client seeding completed");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding clients:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedClients();
