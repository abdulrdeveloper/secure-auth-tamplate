import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const REQUIRED_ENV = [
  "MONGO_URI",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
  "RESEND_API_KEY",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "FRONTEND_URL",
  "EMAIL_FROM",
  "COOKIE_SAMESITE",
];

const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`Missing environment variables: ${missingEnv.join(", ")}`);
  process.exit(1);
}

if (!["lax", "none"].includes(process.env.COOKIE_SAMESITE as string)) {
  console.error('COOKIE_SAMESITE must be "lax" or "none"');
  process.exit(1);
}

if (process.env.ACCESS_TOKEN_SECRET === process.env.REFRESH_TOKEN_SECRET) {
  console.error("ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be different");
  process.exit(1);
}

const PORT = process.env.PORT || 3000;

await connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
