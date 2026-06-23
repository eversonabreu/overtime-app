// Cliente HTTP centralizado usando Axios.
// Equivalente ao HttpClient do .NET, mas com interceptors
// que rodam automaticamente em toda requisição/resposta.

import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import config from '../config/config';
import i18n from '../i18n';
import type { TokenResponse } from '../types/auth.types';
import type { ApiResponse } from '../types/api.types';

// Chaves usadas no localStorage para persistir os tokens entre sessões
const ACCESS_TOKEN_KEY = 'overtime_access_token';
const REFRESH_TOKEN_KEY = 'overtime_refresh_token';

// ─── Helpers de token ────────────────────────────────────────────────────────

export const tokenStorage = {
  getAccess: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  set: (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

// ─── Instância do Axios ───────────────────────────────────────────────────────

// Criamos uma instância configurada em vez de usar o axios diretamente.
// Assim centralizamos a baseURL e outros defaults.
const api = axios.create({
  baseURL: `${config.apiBaseUrl}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Interceptor de REQUEST ───────────────────────────────────────────────────

// Roda antes de cada requisição ser enviada.
// Similar a um DelegatingHandler no .NET.
api.interceptors.request.use((requestConfig: InternalAxiosRequestConfig) => {
  // Adiciona o token JWT no header Authorization
  const token = tokenStorage.getAccess();
  if (token) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }

  // Adiciona o header de idioma — o backend usa para retornar
  // mensagens de erro no idioma correto
  requestConfig.headers['x-language'] = i18n.language;

  return requestConfig;
});

// ─── Controle de refresh em andamento ────────────────────────────────────────

// Evita que múltiplas requisições simultâneas disparem
// vários refreshes ao mesmo tempo (race condition)
let isRefreshing = false;
let pendingRequests: Array<(token: string) => void> = [];

const processPendingRequests = (token: string) => {
  pendingRequests.forEach(callback => callback(token));
  pendingRequests = [];
};

// ─── Interceptor de RESPONSE ──────────────────────────────────────────────────

// Roda depois de cada resposta recebida.
// Aqui tratamos os erros globais conforme o contrato HTTP definido.
api.interceptors.response.use(
  // Resposta bem-sucedida — passa direto
  response => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;

    // 406 — Token expirado: tenta renovar com o refresh token
    if (status === 406 && !originalRequest._retry) {
      const refreshToken = tokenStorage.getRefresh();

      if (!refreshToken) {
        tokenStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // Marca para não entrar em loop infinito
      originalRequest._retry = true;

      if (isRefreshing) {
        // Se já está renovando, coloca na fila e aguarda
        return new Promise(resolve => {
          pendingRequests.push((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const { data } = await axios.post<ApiResponse<TokenResponse>>(
          `${config.apiBaseUrl}/api/auth/refresh`,
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefresh } = data.data;
        tokenStorage.set(accessToken, newRefresh);
        processPendingRequests(accessToken);

        // Reenvia a requisição original com o novo token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch {
        tokenStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    // 401 — Token ausente ou inválido: redireciona para login
    if (status === 401) {
      tokenStorage.clear();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Para os demais erros (400, 403, 404, 422, 500...)
    // deixamos propagar para quem chamou tratar individualmente
    return Promise.reject(error);
  }
);

export default api;
