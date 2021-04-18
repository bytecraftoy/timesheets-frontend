import React from 'react'
import { useRecoilState } from 'recoil'

import { IconButton, Snackbar } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import Alert from '@material-ui/lab/Alert'
import notificationState from '../common/atoms'

const Toast: React.FC = () => {
  const open = true
  const [notification, setNotification] = useRecoilState(notificationState)

  const handleClose = () => {
    setNotification({ message: null, severity: undefined })
  }

  return (
    <>
      <Snackbar open={open}>
        <Alert variant="filled" severity={notification.severity} data-cy="alert">
          {notification.message}
          <IconButton
            size="small"
            data-cy="close-notification-button"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Alert>
      </Snackbar>
    </>
  )
}
export default Toast
