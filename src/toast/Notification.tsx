import React from 'react'
import { useRecoilValue } from 'recoil'
import notificationState from '../common/atoms'
import Toast from './Toast'

const Notification: React.FC = () => {
  const notification = useRecoilValue(notificationState)

  return <>{notification.message && <Toast />}</>
}

export default Notification
