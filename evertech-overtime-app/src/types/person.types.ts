export interface Person {
  id: string;
  name: string;
  registration: string;
  email: string;
  isActive: boolean;
  isPasswordPendingReset: boolean;
  isBlackTheme: boolean;
  isAdmin: boolean;
  hourlyRate: number;
  compensatoryTimeEnabled: boolean;
  municipalityId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePersonRequest {
  name: string;
  registration: string;
  email: string;
  isAdmin: boolean;
  hourlyRate: number;
  compensatoryTimeEnabled: boolean;
  municipalityId: string;
}

export interface CreateFirstPersonRequest {
  name: string;
  registration: string;
  email: string;
}

export interface UpdatePersonRequest {
  id: string;
  name: string;
  registration: string;
  email: string;
  isActive: boolean;
  hourlyRate: number;
  compensatoryTimeEnabled: boolean;
  municipalityId: string;
}

export interface ChangePasswordRequest {
  personId: string;
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordRequest {
  personId: string;
  newPassword: string;
}

export interface RequestPasswordResetRequest {
  email: string;
}

export interface UpdateThemeRequest {
  isBlackTheme: boolean;
}
