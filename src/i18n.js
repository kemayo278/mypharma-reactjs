import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationFR from '@local/fr/translation.json';
import translationEN from '@local/en/translation.json';

// Charger la langue à partir de localStorage, sinon utiliser le français par défaut
const savedLanguage = localStorage.getItem('language') || 'fr';

const resources = {
  fr: {
    translation: translationFR,
  },
  en: {
    translation: translationEN,
  },
};

i18n
  .use(initReactI18next) // Connecter i18next avec React
  .init({
    resources,
    lng: savedLanguage, // Utiliser la langue sauvegardée ou le français par défaut
    fallbackLng: 'fr', // Langue de secours si la traduction n'est pas disponible
    interpolation: {
      escapeValue: false, // React échappe déjà les valeurs
    },
  });

export default i18n;
