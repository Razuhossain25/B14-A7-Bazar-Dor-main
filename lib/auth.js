import { betterAuth } from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";

const memoryDb = (globalThis._betterAuthMemoryDb ??= {
  user: [],
  session: [],
  account: [],
  verification: [],
});
const baseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";

export const auth = betterAuth({
  database: memoryAdapter(memoryDb),
  secret: process.env.BETTER_AUTH_SECRET || "bazardor-secret-key-32-chars-long!!",
  baseURL,
  emailAndPassword: { enabled: true, autoSignIn: false },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "google-client-id-placeholder",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || "google-client-secret-placeholder",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "github-client-id-placeholder",
      clientSecret:
        process.env.GITHUB_CLIENT_SECRET || "github-client-secret-placeholder",
    },
  },
  trustedOrigins: [
    baseURL,
    "http://localhost:3000",
    "http://localhost:3001",
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ],
});
