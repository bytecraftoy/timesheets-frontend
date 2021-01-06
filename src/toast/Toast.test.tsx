// eslint-disable-next-line camelcase
import { snapshot_UNSTABLE } from 'recoil'
import notificationState from '../common/atoms'

describe('testing default notificationState', () => {
  const message = null
  const severity = undefined

  it('notificationState default value should be {message: null, severity: undefined}', () => {
    const initialSnapshot = snapshot_UNSTABLE()
    expect(initialSnapshot.getLoadable(notificationState).getValue().message).toBe(message)
    expect(initialSnapshot.getLoadable(notificationState).getValue().severity).toBe(severity)
  })
})

describe('testing notificationState when a success message is created', () => {
  const message = 'Success message!'
  const severity = 'success'

  it('notificationState should be success message', () => {
    const testSnapshot = snapshot_UNSTABLE(({ set }) =>
      set(notificationState, { message, severity })
    )
    expect(testSnapshot.getLoadable(notificationState).getValue().message).toBe(message)
    expect(testSnapshot.getLoadable(notificationState).getValue().severity).toBe(severity)
  })
})
