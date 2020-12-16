import { atom } from 'recoil'
import { NotificationMessage } from './types'

const defaultNotificationValue: NotificationMessage = { message: null, severity: undefined }

const notificationState = atom({
  key: 'notification',
  default: defaultNotificationValue,
})

export default notificationState
