// Configuração do i18next — biblioteca de internacionalização para React.
// Funciona de forma similar ao IStringLocalizer do .NET:
// você define chaves e o sistema retorna o texto no idioma correto.

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import config from '../config/config';
import br from './locales/br';
import en from './locales/en';
import es from './locales/es';

i18n
  // Integra o i18next com o React (permite usar o hook useTranslation nos componentes)
  .use(initReactI18next)
  .init({
    resources: {
      br: { translation: br },
      en: { translation: en },
      es: { translation: es },
    },
    // Idioma inicial vindo do arquivo de configuração
    lng: config.defaultLanguage,
    // Idioma de fallback caso uma chave não exista no idioma atual
    fallbackLng: 'en',
    interpolation: {
      // O React já protege contra XSS, então desabilitamos o escape do i18next
      escapeValue: false,
    },
  });

export default i18n;
