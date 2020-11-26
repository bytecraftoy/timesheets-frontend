export interface Manager {
  id: number
  firstName: string
  lastName: string
}

export interface Employee {
  id: number
  firstName: string
  lastName: string
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
  lastEditor: Manager
}
