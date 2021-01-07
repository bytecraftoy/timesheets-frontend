import React from 'react'
import { I18nextProvider } from 'react-i18next'

import i18n from '../i18n'

// TODO: tämä ei vielä toimi
const TestApp: React.FC<React.FC> = (elementToRender) => {
  return <I18nextProvider i18n={i18n}>{elementToRender}</I18nextProvider>
}

const t = (key: string): string => {
  return i18n.t(key)
}

export { TestApp, t }
