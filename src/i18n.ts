import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import translations from './locales/en_translation.json'

i18n.use(initReactI18next).init({
  resources: { en: { translations } },
  lng: 'en',
  debug: true,
  ns: ['translations'],
  defaultNS: 'translations',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
