import axios from 'axios'
import { Employee, EmployeeWithInputs } from '../common/types'

const baseUrl = process.env.REACT_APP_BACKEND_HOST

const getAllEmployees = async (): Promise<Employee[]> => {
  const { data } = await axios.get(`${baseUrl}/employees`)
  return data as Employee[]
}

const getEmployeeFullName = (employee: Employee | EmployeeWithInputs): string => {
  return `${employee.firstName} ${employee.lastName}`
}

export { getAllEmployees, getEmployeeFullName }
