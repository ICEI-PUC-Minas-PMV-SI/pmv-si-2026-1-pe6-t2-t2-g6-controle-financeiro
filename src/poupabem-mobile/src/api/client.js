import { API_BASE_URL } from './config';

export async function request(path, { method = 'GET', body, token, params } = {}) {
  const url = buildUrl(path, params);
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(await extractError(response));
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function extractErrorMessage(error) {
  return error?.message || 'Erro inesperado';
}

function buildUrl(path, params) {
  const url = new URL(path, API_BASE_URL);

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

async function extractError(response) {
  try {
    const data = await response.json();
    return data.message || data.title || `Erro ${response.status}`;
  } catch {
    return `Erro ${response.status}`;
  }
}
