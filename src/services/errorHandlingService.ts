import { useEffect } from 'react'
import { useSetRecoilState } from 'recoil'
import notificationState from '../common/atoms'

const useAPIErrorHandler = (fn: () => Promise<void>, finallyFn: () => void): void => {
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

export default useAPIErrorHandler
