import { createContext } from 'react'
import { UserContextType } from '../common/types'

const guestUser = {
  id: '',
  firstName: '',
  lastName: '',
  isManager: true,
}

const UserContext = createContext<UserContextType>(guestUser)

export default UserContext
