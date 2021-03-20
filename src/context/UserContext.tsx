/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState } from 'react'
import { UserContextType, UserContextProps, SetUserContextType } from '../common/types'

const guestUser = {
  id: '',
  firstName: '',
  lastName: '',
  isManager: true,
}

const setDefault: SetUserContextType = () => guestUser

const UserContext = createContext<UserContextProps>({
  user: guestUser,
  setUserContext: setDefault,
})

export function UserProvider({ children }: any): JSX.Element {
  const [user, setUserContext] = useState<UserContextType>(guestUser)

  return <UserContext.Provider value={{ user, setUserContext }}>{children}</UserContext.Provider>
}

export const useUserContext = () => {
  return useContext(UserContext)
}
