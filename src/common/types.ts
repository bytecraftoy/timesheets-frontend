export interface Manager {
  id: string
  username: string
  firstName: string
  lastName: string
}

export interface Employee {
  id: string
  username: string
  firstName: string
  lastName: string
}

export interface Client {
  id: string
  name: string
}

export interface Project {
  id: string
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
  description: string
  date: string
  project: string
  employee: string
}

export interface ProjectFormSelectItem {
  id: string
  name: string
}

export interface ProjectFormValues {
  name: string
  description: string
  client: string
  owner: string
  billable: boolean
}

export interface UsersProjectsWithTimeInputs {
  id: string
  username: string
  projects: ProjectWithTimeInputs
}

export interface ProjectWithTimeInputs {
  id: string
  name: string
  inputs: WeekInputs
}

export interface Input {
  time: string
  description: string
}

export interface WeekInputs {
  mondayInput: Input
  tuesdayInput: Input
  wednesdayInput: Input
  thursdayInput: Input
  fridayInput: Input
  saturdayInput: Input
  sundayInput: Input
}

export interface TimeInput {
  id: string
  input: number
  description: string
  date: string
  creationTimestamp: number
  lastEdited: number
}

export type Severity = 'error' | 'success' | 'info' | 'warning' | undefined

export interface NotificationMessage {
  message: string | null
  severity: Severity
}
