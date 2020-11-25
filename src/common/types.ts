export interface Manager {
  id: number
  username: string
  firstName: string
  lastName: string
}

export interface Employee {
  id: number
  username: string
  firstName: string
  lastName: string
}

export interface Client {
  id: number
  name: string
}

export interface Project {
  id: number
  name: string
  description: string
  owner: Manager
  creator: Manager
  managers: Manager[]
  client: string
  billable: boolean
  employees: Employee[]
  tags?: string[]
  creationTimestamp: number
  lastEdited: number
  lastEditor: string
}
