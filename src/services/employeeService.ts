import qs from 'qs'
import axios from './axiosConfig'
import { Employee, User, UserContextType } from '../common/types'

const getAllEmployees = async (userId: string): Promise<Employee[]> => {
  const { data } = await axios(userId).get('/employees')
  return data as Employee[]
}

const getEmployeesByProjectIds = async (
  projectIds: string[],
  userId: string
): Promise<Employee[]> => {
  const { data } = await axios(userId).get('/projects/employees', {
    params: {
      projects: projectIds,
    },
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    },
  })
  return data as Employee[]
}

const getEmployeeFullName = (employee: User): string => {
  return `${employee.firstName} ${employee.lastName}`
}

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

export {
  getAllEmployees,
  getEmployeesByProjectIds,
  getEmployeeFullName,
  employeesToUserContextItem,
}
