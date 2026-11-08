import { Link } from "react-router-dom";
import { AuthHeader, AuthLayout } from "../components/auth-layout";

export function NotFoundPage() {
  return (
    <AuthLayout>
      <AuthHeader title="Page not found" description="The page you are looking for does not exist." />
      <Link
        to="/"
        className="flex h-11 w-full items-center justify-center rounded-lg bg-white text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
      >
        Go to Clavis
      </Link>
    </AuthLayout>
  );
}
