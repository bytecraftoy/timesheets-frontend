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

export interface Hours {
  input: number
  date: string
  project: number
  employee: number
}

export interface ProjectFormValues {
  name: string
  description: string
  client: string
  owner: string
  billable: boolean
}

export interface UsersProjectsWithTimeInputs {
  id: number
  username: string
  projects: ProjectWithTimeInputs
}

export interface ProjectWithTimeInputs {
  id: number
  name: string
  inputs: WeekInputs
}

export interface WeekInputs {
  mondayInput: string
  tuesdayInput: string
  wednesdayInput: string
  thursdayInput: string
  fridayInput: string
  saturdayInput: string
  sundayInput: string
}

export interface TimeInput {
  id: number
  input: number
  date: string
  creationTimestamp: number
  lastEdited: number
}

export type Severity = 'error' | 'success' | 'info' | 'warning' | undefined

export interface NotificationMessage {
  message: string | null
  severity: Severity
}
