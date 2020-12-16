import React from 'react'
// eslint-disable-next-line camelcase
import { RecoilRoot, snapshot_UNSTABLE } from 'recoil'
import { I18nextProvider } from 'react-i18next'
import { render, screen } from '@testing-library/react'
import notificationState from '../common/atoms'
import Toast from './Toast'
import App from '../app/App'
import i18n from '../i18n'

describe('testing default notificationState', () => {
  const message = null
  const severity = undefined

  test('notificationState default value should be {message: null, severity: undefined}', () => {
    const initialSnapshot = snapshot_UNSTABLE()
    expect(initialSnapshot.getLoadable(notificationState).getValue().message).toBe(message)
    expect(initialSnapshot.getLoadable(notificationState).getValue().severity).toBe(severity)
  })

  test('when notificationState has default falue, Toast should not be visible', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <RecoilRoot initializeState={(snap) => snap.set(notificationState, { message, severity })}>
          <App />
        </RecoilRoot>
      </I18nextProvider>
    )
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

describe('testing notificationState when a success message is created', () => {
  const message = 'Success message!'
  const severity = 'success'

  test('notificationState should be success message', () => {
    const testSnapshot = snapshot_UNSTABLE(({ set }) =>
      set(notificationState, { message, severity })
    )
    expect(testSnapshot.getLoadable(notificationState).getValue().message).toBe(message)
    expect(testSnapshot.getLoadable(notificationState).getValue().severity).toBe(severity)
  })

  test('when notificationState has a message, it should be shown in Toast component', () => {
    render(
      <RecoilRoot initializeState={(snap) => snap.set(notificationState, { message, severity })}>
        <Toast />
      </RecoilRoot>
    )
    expect(screen.getByText(message)).toBeInTheDocument()
  })
})
