// Tipos TypeScript que espelham os DTOs do backend.
// No .NET você tinha classes C# como "TokenResponseModel" —
// aqui fazemos o equivalente com interfaces TypeScript.

export interface LoginRequest {
  credential: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RevokeTokenRequest {
  refreshToken: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  isPasswordPendingReset: boolean;
  isBlackTheme: boolean;
}

// Representa o usuário logado decodificado do JWT.
// O JWT é um token Base64 que contém "claims" — similar
// ao ClaimsPrincipal do .NET.
export interface AuthUser {
  personId: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isLeader: boolean;
  leaderOfGroups: string[];
  isPasswordPendingReset: boolean;
  isBlackTheme: boolean;
}
