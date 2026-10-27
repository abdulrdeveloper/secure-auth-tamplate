const API_BASE_URL = `${(import.meta.env.VITE_API_URL ?? "http://localhost:3000").replace(/\/+$/, "")}/api`;

const NO_REFRESH_PATHS = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/logout"];

type ApiRequestOptions = {
  method?: "GET" | "POST";
  data?: unknown;
};

let refreshPromise: Promise<boolean> | null = null;

function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
      .then((response) => response.ok)
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function send(path: string, { method = "GET", data }: ApiRequestOptions) {
  try {
    return await fetch(`${API_BASE_URL}${path}`, {
      method,
      credentials: "include",
      headers:
        data === undefined ? undefined : { "Content-Type": "application/json" },
      body: data === undefined ? undefined : JSON.stringify(data),
    });
  } catch {
    throw new Error(
      "Unable to connect to the service. Check your connection and try again.",
    );
  }
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  let response = await send(path, options);

  if (
    response.status === 401 &&
    !NO_REFRESH_PATHS.includes(path) &&
    (await refreshSession())
  ) {
    response = await send(path, options);
  }

  const body = (await response.json().catch(() => null)) as
    | ({ message?: string } & T)
    | null;

  if (!response.ok) {
    throw new Error(
      body?.message ?? "Something went wrong. Please try again in a moment.",
    );
  }

  return body as T;
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again in a moment.";
}
