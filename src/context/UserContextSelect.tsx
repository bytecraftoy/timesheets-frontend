import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@material-ui/core/styles'
import { AccountCircle } from '@material-ui/icons'
import { FormControl, MenuItem, Select } from '@material-ui/core'
import { useUserContext } from './UserContext'
import { UserContextType } from '../common/types'
import {
  getAllEmployees,
  getEmployeeFullName,
  employeesToUserContextItem,
} from '../services/employeeService'
import { useAPIErrorHandler } from '../services/errorHandlingService'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0.5),
    minWidth: 192,
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  userSelect: {
    backgroundColor: '#fff',
    borderRadius: theme.spacing(1),
  },
}))

const UserContextSelect: React.FC = () => {
  const classes = useStyles()
  const { t } = useTranslation()

  const { user, setUserContext } = useUserContext()
  const [users, setUsers] = useState<UserContextType[]>([])

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedValue: string = event.target.value as string
    const selectedUser = users.find((u) => u.id === selectedValue)
    if (selectedUser) {
      setUserContext(selectedUser)
    }
  }

  const fetchEmployees = useCallback(async () => {
    const userResponse = await getAllEmployees()
    setUsers(employeesToUserContextItem(userResponse))
  }, [])

  useAPIErrorHandler(fetchEmployees)

  return (
    <>
      <AccountCircle fontSize="large" className={classes.icon} />
      <FormControl variant="outlined" className={classes.formControl}>
        <Select
          className={classes.userSelect}
          id="user-select"
          value={user.id}
          onChange={handleChange}
        >
          {users.length === 0 && (
            <MenuItem disabled value="">
              {t('user.fetching')}
            </MenuItem>
          )}
          {users.map((obj) => {
            return (
              <MenuItem key={obj.id} value={obj.id}>
                {getEmployeeFullName(obj)}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
    </>
  )
}

export default UserContextSelect
