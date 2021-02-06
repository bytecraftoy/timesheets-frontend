import { Client, Manager, Project, FormSelectItem, Employee } from '../common/types'

const employeesToFormSelectItem = (employees: Employee[]): FormSelectItem[] => {
  return employees.map((employee) => {
    return { id: employee.id, name: `${employee.firstName} ${employee.lastName}` }
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
