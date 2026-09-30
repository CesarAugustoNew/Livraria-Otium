const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

const TOKEN_KEY = 'otium.token';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

/** Erro padronizado: espelha o ErrorResponse do backend. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

type QueryValue = string | number | boolean | undefined | null;
type Query = Record<string, QueryValue | QueryValue[]>;

interface RequestOptions extends Omit<RequestInit, 'body'> {
  query?: Query;
  body?: unknown;
}

function buildUrl(path: string, query?: Query): string {
  const params = new URLSearchParams();
  Object.entries(query ?? {}).forEach(([k, v]) => {
    // arrays viram parâmetros repetidos (?authorIds=1&authorIds=2), como o Spring espera para List<UUID>
    const values = Array.isArray(v) ? v : [v];
    values.forEach((value) => {
      if (value !== undefined && value !== null && value !== '') params.append(k, String(value));
    });
  });
  const qs = params.toString();
  return `${BASE_URL}${path}${qs ? `?${qs}` : ''}`;
}

/** Único ponto de saída HTTP do front: componentes nunca chamam fetch diretamente. */
export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { query, body, headers, ...rest } = options;
  const token = tokenStorage.get();

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      ...rest,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'NetworkError', 'Não foi possível conectar ao servidor.');
  }

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    throw new ApiError(
      response.status,
      data?.error ?? 'HttpError',
      data?.message ?? 'Não foi possível concluir a operação.',
    );
  }

  return response.status === 204 ? (undefined as T) : ((await response.json()) as T);
}
