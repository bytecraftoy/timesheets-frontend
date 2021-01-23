import { Client, Manager, FormSelectItem } from '../common/types'

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

export { clientToFormSelectItem, managerToFormSelectItem }
