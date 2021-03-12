import { createContext } from 'react'
import { UserContextType } from '../common/types'

const guestUser = {
  id: '12345',
  name: 'Guest user',
  isManager: false,
}

const UserContext = createContext<UserContextType>(guestUser)

export default UserContext
