// Serviço de autenticação.
// Agrupa todas as chamadas HTTP relacionadas a auth,
// similar a um "AuthService" no .NET.

import api, { tokenStorage } from './api';
import type { ApiResponse } from '../types/api.types';
import type {
  LoginRequest,
  TokenResponse,
  AuthUser,
  RevokeTokenRequest,
} from '../types/auth.types';

// Decodifica o payload do JWT sem biblioteca externa.
// O JWT tem 3 partes separadas por ponto: header.payload.signature
// O payload é Base64 e contém as claims do usuário.
const decodeJwt = (token: string): Record<string, unknown> => {
  try {
    const payload = token.split('.')[1];
    // atob() converte Base64 para string
    return JSON.parse(atob(payload));
  } catch {
    return {};
  }
};

// Converte as claims do JWT no tipo AuthUser que usamos no frontend
export const parseAuthUser = (tokenResponse: TokenResponse): AuthUser => {
  const claims = decodeJwt(tokenResponse.accessToken);

  // "leaderOfGroups" pode vir como string única ou array,
  // dependendo de quantos grupos o usuário lidera
  const leaderOfGroups = Array.isArray(claims.leaderOfGroups)
    ? (claims.leaderOfGroups as string[])
    : claims.leaderOfGroups
      ? [claims.leaderOfGroups as string]
      : [];

  return {
    personId: claims.sub as string,
    name: claims.name as string,
    email: claims.email as string,
    isAdmin: claims.isAdmin === 'true',
    isLeader: claims.isLeader === 'true',
    leaderOfGroups,
    isPasswordPendingReset: tokenResponse.isPasswordPendingReset,
    isBlackTheme: tokenResponse.isBlackTheme,
  };
};

const authService = {
  login: async (request: LoginRequest): Promise<{ token: TokenResponse; user: AuthUser }> => {
    const { data } = await api.post<ApiResponse<TokenResponse>>('/auth/login', request);
    const token = data.data;
    const user = parseAuthUser(token);

    // Persiste os tokens no localStorage para sobreviver ao F5
    tokenStorage.set(token.accessToken, token.refreshToken);

    return { token, user };
  },

  revoke: async (): Promise<void> => {
    const refreshToken = tokenStorage.getRefresh();
    if (!refreshToken) return;

    const request: RevokeTokenRequest = { refreshToken };
    await api.post('/auth/revoke', request);
    tokenStorage.clear();
  },

  // Verifica se ainda há um token armazenado (sessão ativa)
  isAuthenticated: (): boolean => {
    return !!tokenStorage.getAccess();
  },
};

export default authService;
