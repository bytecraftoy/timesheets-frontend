import React from 'react'
import { render, screen } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'

import i18n from '../i18n'

import { t } from '../testUtils'

import App from './App'

test('renders timesheets title', () => {
  render(
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  )
  const appTitle = screen.getByText(t('appTitle'))
  expect(appTitle).toBeInTheDocument()
})

test('renders navigation link to projects view', () => {
  render(
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  )
  const projectsTitle = screen.getByText(t('projectsTitle'))
  expect(projectsTitle).toBeInTheDocument()
})
