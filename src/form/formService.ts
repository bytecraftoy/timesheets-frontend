import { Client, Manager, Project, FormSelectItem, User } from '../common/types'
import { getEmployeeFullName } from '../services/employeeService'

const employeesToFormSelectItem = (employees: User[]): FormSelectItem[] => {
  return employees.map((employee: User) => {
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
    return { id: manager.id, name: getEmployeeFullName(manager) }
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
