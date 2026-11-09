import { Check, Copy } from "lucide-react";
import { useState } from "react";
import type { BrandName } from "./brand-icons";
import { BrandMark } from "./brand-mark";
import { useReveal } from "./use-reveal";

const ENV_CODE = `CLAVIS_ISSUER_URL=https://auth.example.com
CLAVIS_CLIENT_ID=your-client-id
CLAVIS_CLIENT_SECRET=your-client-secret`;

const AUTHJS_CODE = `import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      id: "clavis",
      name: "Clavis",
      type: "oidc",
      issuer: process.env.CLAVIS_ISSUER_URL,
      clientId: process.env.CLAVIS_CLIENT_ID,
      clientSecret: process.env.CLAVIS_CLIENT_SECRET,
    },
  ],
});`;

const NODE_CODE = `import * as client from "openid-client";

const config = await client.discovery(
  new URL(process.env.CLAVIS_ISSUER_URL),
  process.env.CLAVIS_CLIENT_ID,
  process.env.CLAVIS_CLIENT_SECRET,
);

// 1. Send the user to Clavis
const verifier = client.randomPKCECodeVerifier();
const signInUrl = client.buildAuthorizationUrl(config, {
  redirect_uri: "https://notes.example.com/callback",
  scope: "openid profile email",
  code_challenge: await client.calculatePKCECodeChallenge(verifier),
  code_challenge_method: "S256",
});

// 2. On /callback, swap the code for tokens
const tokens = await client.authorizationCodeGrant(config, callbackUrl, {
  pkceCodeVerifier: verifier,
});
tokens.claims(); // { sub, name, email, email_verified, ... }`;

const DISCOVERY_CODE = `{
  "issuer": "https://auth.example.com",
  "authorization_endpoint": "https://auth.example.com/oauth/authorize",
  "token_endpoint": "https://auth.example.com/oauth/token",
  "userinfo_endpoint": "https://auth.example.com/oauth/userinfo",
  "jwks_uri": "https://auth.example.com/.well-known/jwks.json",
  "response_types_supported": ["code"],
  "grant_types_supported": ["authorization_code"],
  "scopes_supported": ["openid", "profile", "email"],
  "id_token_signing_alg_values_supported": ["RS256"],
  "code_challenge_methods_supported": ["S256"],
  "token_endpoint_auth_methods_supported": ["client_secret_basic", "client_secret_post"]
}`;

const TABS: { id: string; label: string; brand: BrandName; files: { title: string; code: string }[] }[] = [
  {
    id: "authjs",
    label: "Next.js · Auth.js",
    brand: "nextjs",
    files: [
      { title: ".env.local", code: ENV_CODE },
      { title: "auth.ts", code: AUTHJS_CODE },
    ],
  },
  {
    id: "node",
    label: "Node · openid-client",
    brand: "node",
    files: [{ title: "auth.mjs", code: NODE_CODE }],
  },
  {
    id: "discovery",
    label: "Discovery document",
    brand: "openid",
    files: [{ title: "GET /.well-known/openid-configuration", code: DISCOVERY_CODE }],
  },
];

const STEPS = [
  "Register your app in Clavis and set its redirect URI. You get a client ID and a secret.",
  "Put them in your app's environment, with the address of your Clavis server as the issuer.",
  "Add the provider. The library finds every endpoint from the discovery document.",
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy code"}
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-50"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#0b0b0d]">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2">
        <span className="truncate font-mono text-xs text-zinc-500">{title}</span>
        <CopyButton text={code} />
      </div>
      <pre className="max-h-[420px] overflow-auto p-4 font-mono text-[13px] leading-relaxed text-zinc-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function Integrate() {
  const ref = useReveal<HTMLDivElement>();
  const [tab, setTab] = useState(TABS[0].id);
  const active = TABS.find((item) => item.id === tab) ?? TABS[0];

  return (
    <section id="integrate" className="scroll-mt-16 border-t border-zinc-800/80 py-24">
      <div ref={ref} className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="reveal">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Add it to your app in a few lines.
          </h2>
          <p className="mt-4 text-zinc-400">
            Any OpenID Connect library works. Pick yours, or read the discovery document the
            library reads.
          </p>
          <ol className="mt-8 space-y-5">
            {STEPS.map((step, index) => (
              <li key={step} className="flex gap-4 text-sm leading-relaxed text-zinc-400">
                <span className="font-mono text-brass">{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="reveal min-w-0" style={{ transitionDelay: "150ms" }}>
          <div role="tablist" aria-label="Integration examples" className="mb-4 flex flex-wrap gap-2">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={item.id === tab}
                onClick={() => setTab(item.id)}
                className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                  item.id === tab
                    ? "border-zinc-600 bg-zinc-900 text-zinc-50"
                    : "border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                <BrandMark name={item.brand} className="size-3.5" />
                {item.label}
              </button>
            ))}
          </div>
          <div role="tabpanel" className="space-y-4">
            {active.files.map((file) => (
              <CodeBlock key={file.title} title={file.title} code={file.code} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
