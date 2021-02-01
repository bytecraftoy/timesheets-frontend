import { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import notificationState from '../common/atoms'

const useAPIErrorHandlerWithFinally = (fn: () => Promise<void>, finallyFn: () => void): void => {
  const setNotification = useSetRecoilState(notificationState)

  return useEffect((): void => {
    const handleAPIError = async (): Promise<void> => {
      let exception = false
      try {
        await fn()
      } catch (error) {
        exception = true
        setNotification({ message: error.message, severity: 'error' })
      } finally {
        if (!exception) {
          finallyFn()
        }
      }
    }
    handleAPIError()
  }, [fn, finallyFn, setNotification])
}

const useAPIErrorHandler = (fn: () => Promise<void>): void => {
  const setNotification = useSetRecoilState(notificationState)

  return useEffect((): void => {
    const handleAPIError = async (): Promise<void> => {
      try {
        await fn()
      } catch (error) {
        setNotification({ message: error.message, severity: 'error' })
      }
    }
    handleAPIError()
  }, [fn, setNotification])
}

export { useAPIErrorHandler, useAPIErrorHandlerWithFinally }
