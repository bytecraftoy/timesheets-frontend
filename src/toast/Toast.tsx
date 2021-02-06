import React from 'react'
import { useRecoilState } from 'recoil'

import { IconButton, Snackbar } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import Alert from '@material-ui/lab/Alert'
import notificationState from '../common/atoms'

// TODO: "Nämä severity tasot kannattaa hilloa jonnekin constantteina, josta käyttää. Esim constants.js tiedoston alle tai sitten itse notifikaatio-tiedoston kylkeen, josta exporttaa ulos"

const Toast: React.FC = () => {
  const open = true
  const [notification, setNotification] = useRecoilState(notificationState)

  const handleClose = () => {
    setNotification({ message: null, severity: undefined })
  }

  return (
    <>
      <Snackbar open={open}>
        <Alert variant="filled" severity={notification.severity}>
          {notification.message}
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Alert>
      </Snackbar>
    </>
  )
}
export default Toast
