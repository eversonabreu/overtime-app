// Tipos genéricos que representam o contrato HTTP da API.
// Todo endpoint de sucesso retorna { data: T },
// erros 400 retornam { errors: string[] },
// erros 422 retornam { message: string }.

export interface ApiResponse<T> {
  data: T;
}

export interface ApiErrorResponse {
  errors?: string[];
  message?: string;
}
