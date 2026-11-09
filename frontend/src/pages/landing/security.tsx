import { useReveal } from "./use-reveal";

// Each item describes something the backend really does.
const FEATURES = [
  {
    title: "Signed with RS256",
    text: "ID tokens are signed with a private key. Your apps check them with the public key from the JWKS endpoint, so they never need a shared secret.",
    wide: true,
  },
  {
    title: "PKCE",
    text: "The S256 method is supported for public clients.",
  },
  {
    title: "Single-use codes",
    text: "An authorization code is deleted the moment it is used, and it expires after 2 minutes.",
  },
  {
    title: "Exact redirect matching",
    text: "A request is refused unless its redirect URI matches one registered for the app.",
  },
  {
    title: "Hashed client secrets",
    text: "Client secrets are stored as bcrypt hashes and shown only once.",
  },
  {
    title: "Email verification",
    text: "People cannot sign in until they confirm a one-time code sent to their email.",
    wide: true,
  },
  {
    title: "Rate limits",
    text: "Sign-in, one-time codes, the token endpoint and client registration are all limited per IP address.",
  },
];

export function Security() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="border-t border-zinc-800/80 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Careful with the parts that are easy to get wrong.
          </h2>
          <p className="mt-4 text-zinc-400">
            Token signing, code handling and redirects are already done and tested.
          </p>
        </div>

        <div ref={ref} className="mt-14 grid gap-4 md:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <article
              key={feature.title}
              className={`reveal rounded-2xl border border-zinc-800 bg-[#0b0b0d] p-6 transition-colors hover:border-zinc-700 ${
                feature.wide ? "md:col-span-2" : ""
              }`}
              style={{ transitionDelay: `${index * 70}ms` }}
            >
              <h3 className="text-base font-semibold text-zinc-50">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{feature.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
