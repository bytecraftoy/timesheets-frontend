import {
  Client,
  Manager,
  Project,
  FormSelectItem,
  Employee,
  UserContextType,
} from '../common/types'
import { getEmployeeFullName } from '../services/employeeService'

const employeesToFormSelectItem = (employees: (Employee | UserContextType)[]): FormSelectItem[] => {
  return employees.map((employee: Employee | UserContextType) => {
    return { id: employee.id, name: getEmployeeFullName(employee) }
  })
}

const clientToFormSelectItem = (clients: Client[]): FormSelectItem[] => {
  return clients.map((client) => {
    return { id: client.id, name: client.name }
  })
}

const managerToFormSelectItem = (managers: Manager[]): FormSelectItem[] => {
  return managers.map((manager) => {
    return { id: manager.id, name: `${manager.firstName} ${manager.lastName}` }
  })
}

const projectsToFormSelectItem = (projects: Project[]): FormSelectItem[] => {
  return projects.map((project) => {
    return { id: project.id, name: project.name }
  })
}

export {
  employeesToFormSelectItem,
  clientToFormSelectItem,
  managerToFormSelectItem,
  projectsToFormSelectItem,
}
