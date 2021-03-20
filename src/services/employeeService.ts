import axios from 'axios'
import qs from 'qs'
import { Employee, User, UserContextType } from '../common/types'

const baseUrl = process.env.REACT_APP_BACKEND_HOST

const getAllEmployees = async (): Promise<Employee[]> => {
  const { data } = await axios.get(`${baseUrl}/employees`)
  return data as Employee[]
}

const getEmployeesByProjectIds = async (projectIds: string[]): Promise<Employee[]> => {
  const { data } = await axios.get(`${baseUrl}/projects/employees`, {
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
