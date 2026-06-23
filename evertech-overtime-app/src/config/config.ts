// Arquivo central de configuração do frontend.
// Altere aqui o endereço da API e o idioma padrão do sistema.
// Idiomas aceitos: "en" (English), "es" (Español), "br" (Português)

export type Language = 'en' | 'es' | 'br';

const config = {
  apiBaseUrl: 'https://localhost:7000',
  defaultLanguage: 'br' as Language,
};

export default config;
