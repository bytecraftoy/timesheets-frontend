import { Client, Project, FormSelectItem, User } from '../common/types'
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

const projectsToFormSelectItem = (projects: Project[]): FormSelectItem[] => {
  return projects.map((project) => {
    return { id: project.id, name: project.name }
  })
}

export { employeesToFormSelectItem, clientToFormSelectItem, projectsToFormSelectItem }
