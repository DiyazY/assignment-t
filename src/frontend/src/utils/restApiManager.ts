const BASE_URL = "https://localhost:7033";

export class RestApiManager {
  private _defaultOptions: RequestInit;

  constructor(token: string) {
    this._defaultOptions = {
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    }
  }

  get<T>(resource: string, signal: AbortSignal | null = null): Promise<T> {
    return fetch(`${BASE_URL}/api/${resource}`, {
      method: "GET",
      ...this._defaultOptions,
      signal,
    }).then((response) => response.json());
  }

  post<T>(
    resource: string,
    body: T,
    signal: AbortSignal | null = null
  ): Promise<void> {
    return fetch(`${BASE_URL}/api/${resource}`, {
      method: "GET",
      ...this._defaultOptions,
      body: JSON.stringify(body),
      signal,
    }).then((response) => response.json());
  }
}

export function login(
  userName: string,
  password: string,
  signal: AbortSignal | null = null
): Promise<string> {
  return fetch(`${BASE_URL}/api/login`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
    },
    body: JSON.stringify({ userName, password }),
    signal,
  }).then((res) => res.text());
}
