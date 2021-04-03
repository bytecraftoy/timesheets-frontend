import { Client, Project, FormSelectItem, Employee } from '../common/types'
import { getEmployeeFullName } from '../services/employeeService'

const employeesToFormSelectItem = (employees: Employee[]): FormSelectItem[] => {
  return employees.map((employee: Employee) => {
    return { id: employee.id, name: getEmployeeFullName(employee), isManager: employee.isManager }
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
