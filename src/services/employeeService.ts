import axios from 'axios'
import { Employee, EmployeeWithInputs, UserContextType } from '../common/types'

const baseUrl = process.env.REACT_APP_BACKEND_HOST

const getAllEmployees = async (): Promise<Employee[]> => {
  const { data } = await axios.get(`${baseUrl}/employees`)
  return data as Employee[]
}

const getEmployeeFullName = (employee: Employee | EmployeeWithInputs | UserContextType): string => {
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

export { getAllEmployees, getEmployeeFullName, employeesToUserContextItem }
