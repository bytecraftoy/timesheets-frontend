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
  client: Client
  billable: boolean
  employees: Employee[]
  tags?: string[]
  creationTimestamp: number
  lastEdited: number
  lastEditor: Manager
}

export interface ProjectFormValues {
  name: string
  description: string
  client: string
  owner: string
  billable: boolean
}

export type Severity = 'error' | 'success' | 'info' | 'warning' | undefined

export interface NotificationMessage {
  message: string | null
  severity: Severity
}
