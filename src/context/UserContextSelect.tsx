import React, { useCallback, useContext, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { AccountCircle } from '@material-ui/icons'
import { FormControl, MenuItem, Select } from '@material-ui/core'
import UserContext from './UserContext'
import { Employee, UserContextType } from '../common/types'
import { getAllEmployees, getEmployeeFullName } from '../services/employeeService'
import { useAPIErrorHandler } from '../services/errorHandlingService'

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0.5),
    minWidth: theme.spacing(24),
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  userSelect: {
    backgroundColor: '#fff',
    borderRadius: theme.spacing(1),
  },
}))

const employeesToUserContextItem = (employees: Employee[]): UserContextType[] => {
  return employees.map((employee) => {
    return {
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      isManager: employee.isManager,
    }
  })
}

const UserContextSelect: React.FC<{
  setContext: React.Dispatch<React.SetStateAction<UserContextType>>
}> = ({ setContext }) => {
  const classes = useStyles()

  const user = useContext(UserContext).id
  const [users, setUsers] = useState<UserContextType[]>([])

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedValue: string = event.target.value as string
    const selectedUser = users.find((u) => u.id === selectedValue)
    if (selectedUser) {
      setContext(selectedUser)
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
          value={user}
          onChange={handleChange}
        >
          {users.length === 0 && (
            <MenuItem disabled value="">
              Fetching other users
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
