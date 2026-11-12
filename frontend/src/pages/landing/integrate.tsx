import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CopyButton } from "../../components/copy-button";
import type { BrandName } from "./brand-icons";
import { BrandMark } from "./brand-mark";
import { Section } from "./section";

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

function highlightSyntax(code: string, filename: string): React.ReactNode {
  const lines = code.split("\n");

  if (filename.includes(".env")) {
    return lines.map((line, idx) => {
      const eqIdx = line.indexOf("=");
      if (eqIdx !== -1) {
        const key = line.slice(0, eqIdx);
        const val = line.slice(eqIdx + 1);
        return (
          <div key={idx} className="whitespace-pre">
            <span className="text-[#79c0ff]">{key}</span>
            <span className="text-zinc-500">=</span>
            <span className="text-[#a5d6ff]">{val}</span>
          </div>
        );
      }
      return <div key={idx} className="whitespace-pre">{line}</div>;
    });
  }

  if (filename.includes("openid-configuration") || filename.endsWith(".json")) {
    return lines.map((line, idx) => {
      const keyMatch = line.match(/^(\s*)("[\w_]+")(\s*:\s*)(.*)$/);
      if (keyMatch) {
        const [, indent, keyStr, colon, rest] = keyMatch;
        const styledRest = rest.replace(/"([^"]+)"/g, '<span class="text-[#a5d6ff]">"$1"</span>');
        return (
          <div key={idx} className="whitespace-pre">
            {indent}
            <span className="text-[#7ee787]">{keyStr}</span>
            <span className="text-zinc-500">{colon}</span>
            <span dangerouslySetInnerHTML={{ __html: styledRest }} />
          </div>
        );
      }
      return <div key={idx} className="whitespace-pre text-zinc-400">{line}</div>;
    });
  }

  const keywords = new Set(["import", "from", "export", "const", "await", "new", "return", "type", "as", "default"]);
  const types = new Set(["NextAuth", "URL"]);

  return lines.map((line, idx) => {
    const trimmed = line.trimStart();
    if (trimmed.startsWith("//")) {
      return (
        <div key={idx} className="whitespace-pre text-[#6a737d] italic">
          {line}
        </div>
      );
    }

    const tokens = line.split(/(".*?"|'.*?'|\b[\w$]+\b|[^\s\w"']+|\s+)/g).filter(Boolean);

    return (
      <div key={idx} className="whitespace-pre">
        {tokens.map((token, tIdx) => {
          if (token.startsWith('"') || token.startsWith("'")) {
            return <span key={tIdx} className="text-[#a5d6ff]">{token}</span>;
          }
          if (keywords.has(token)) {
            return <span key={tIdx} className="font-medium text-[#ff7b72]">{token}</span>;
          }
          if (types.has(token) || /^[A-Z][a-zA-Z0-9]+$/.test(token)) {
            return <span key={tIdx} className="text-[#ffa657]">{token}</span>;
          }
          if (/^(handlers|signIn|signOut|auth|discovery|randomPKCECodeVerifier|buildAuthorizationUrl|calculatePKCECodeChallenge|authorizationCodeGrant|claims)$/.test(token)) {
            return <span key={tIdx} className="text-[#d2a8ff]">{token}</span>;
          }
          if (/^(providers|id|name|type|issuer|clientId|clientSecret|redirect_uri|scope|code_challenge|code_challenge_method|pkceCodeVerifier)$/.test(token)) {
            return <span key={tIdx} className="text-[#79c0ff]">{token}</span>;
          }
          if (/^[{}()[\].,;:?!=><+*/&|-]+$/.test(token)) {
            return <span key={tIdx} className="text-zinc-500">{token}</span>;
          }
          return <span key={tIdx} className="text-zinc-200">{token}</span>;
        })}
      </div>
    );
  });
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800/90 bg-[#0a0a0d] shadow-2xl transition-colors duration-200 hover:border-zinc-700">
      <div className="flex h-10 items-center justify-between border-b border-zinc-800/80 bg-[#111115] px-4">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-[#ff5f56] shadow-sm" />
          <span className="size-3 rounded-full bg-[#ffbd2e] shadow-sm" />
          <span className="size-3 rounded-full bg-[#27c93f] shadow-sm" />
          <span className="ml-3 font-mono text-xs font-medium text-zinc-400">{title}</span>
        </div>
        <CopyButton text={code} />
      </div>

      <pre className="max-h-[440px] overflow-auto p-5 font-mono text-[13px] leading-[1.75] text-zinc-300">
        <code>{highlightSyntax(code, title)}</code>
      </pre>
    </div>
  );
}

export function Integrate() {
  const [tab, setTab] = useState(TABS[0].id);
  const active = TABS.find((item) => item.id === tab) ?? TABS[0];

  return (
    <Section
      id="integrate"
      kicker="Integrate"
      title="Add it to your app in a few lines."
      lead={
        <>
          <Link to="/developers" className="font-medium text-zinc-200 underline-offset-4 hover:underline">
            Register an app
          </Link>{" "}
          for a client ID and secret, then point any OIDC library at your issuer URL. It finds every endpoint
          from the discovery document.
        </>
      }
      band
      center
    >
      <div className="mx-auto max-w-3xl">
        <div role="tablist" aria-label="Integration examples" className="mb-4 flex flex-wrap justify-center gap-2">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={item.id === tab}
              onClick={() => setTab(item.id)}
              className={`inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors ${
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
    </Section>
  );
}
