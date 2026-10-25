import {
  getSafeApiMessage,
  getSafeAuthMessage,
  type AuthAction,
} from "./auth-messages";

const API_BASE_URL = `${(import.meta.env.VITE_API_URL ?? "http://localhost:3000").replace(/\/+$/, "")}/api`;

type ApiRequestOptions = {
  method?: "GET" | "POST";
  data?: unknown;
  action?: AuthAction;
};

export async function apiRequest<T>(
  path: string,
  { method = "GET", data, action }: ApiRequestOptions = {},
): Promise<T> {
  const cleanPath = path.replace(/^\/+/, "");
  const endpoint = cleanPath.includes("/") ? cleanPath : `auth/${cleanPath}`;
  const url = `${API_BASE_URL}/${endpoint}`;

  let response: Response;

  try {
    response = await fetch(url, {
      method,
      credentials: "include",
      headers:
        data === undefined ? undefined : { "Content-Type": "application/json" },
      body: data === undefined ? undefined : JSON.stringify(data),
    });
  } catch (error) {
    if (!(error instanceof TypeError)) throw error;

    throw new Error(
      action
        ? getSafeAuthMessage(action)
        : "Unable to connect to the service. Check your connection and try again.",
    );
  }

  if (!response.ok) {
    let serverMessage: string | undefined;
    try {
      const errorData = (await response.json()) as { message?: string };
      if (errorData && typeof errorData.message === "string") {
        serverMessage = errorData.message;
      }
    } catch {
    }

    if (serverMessage) {
      throw new Error(serverMessage);
    }

    throw new Error(
      action
        ? getSafeAuthMessage(action, response.status)
        : getSafeApiMessage(response.status),
    );
  }

  try {
    return (await response.json()) as T;
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;

    throw new Error(
      "The service returned an unexpected response. Please try again.",
    );
  }
}
