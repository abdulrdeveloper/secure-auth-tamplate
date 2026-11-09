import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useReveal } from "./use-reveal";

const ENV_CODE = `CLAVIS_ISSUER_URL=https://auth.example.com
CLAVIS_CLIENT_ID=your-client-id
CLAVIS_CLIENT_SECRET=your-client-secret`;

const AUTH_CODE = `import NextAuth from "next-auth";

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
        <span className="font-mono text-xs text-zinc-500">{title}</span>
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-zinc-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function Integrate() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="border-t border-zinc-800/80 py-24">
      <div ref={ref} className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="reveal">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Add it to your app in a few lines.
          </h2>
          <p className="mt-4 text-zinc-400">
            Any OpenID Connect library works. This example uses Auth.js in a Next.js app.
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

        <div className="reveal space-y-4" style={{ transitionDelay: "150ms" }}>
          <CodeBlock title=".env.local" code={ENV_CODE} />
          <CodeBlock title="auth.ts" code={AUTH_CODE} />
        </div>
      </div>
    </section>
  );
}
