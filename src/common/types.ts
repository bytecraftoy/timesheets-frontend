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
  email?: string
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

export interface HoursUpdate {
  id: string
  input: number
  description: string
}

export interface HoursWithSavedIndex<HourType> {
  x: number
  y: number
  hour: HourType
}

export interface FormTextFieldProps {
  className: string
  name: string
  label: string
  handleChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  handleBlur: (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  value: string
  errors: string | undefined
  touched: boolean | undefined
}

export interface FormSelectProps extends Omit<FormTextFieldProps, 'handleChange'> {
  handleChange: (
    e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>,
    child: React.ReactNode
  ) => void
  objects: FormSelectItem[]
}
export interface FormSelectMultipleProps extends Omit<FormSelectProps, 'value' | 'errors'> {
  value: string[]
  errors: string | string[] | undefined
}
export interface FormSelectItem {
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

export interface ProjectAndInputs {
  id: string
  name: string
  inputs: Input[]
}

export interface ProjectAndInputsWithId extends Omit<ProjectAndInputs, 'inputs'> {
  inputs: InputWithId[]
}

export interface Input {
  time: string
  description: string
}

export interface InputWithId extends Input {
  id: string | null
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

// TODO: make sure that these types fully match the billing report data received

export interface BillingReportData {
  startDate: string
  endDate: string
  client: Client
  projects: ProjectStub[]
  creationMillis: number
  grandTotal: number
}
export interface EmployeeWithInputs extends Employee {
  timeInputs: TimeInput[]
  employeeTotal: number
}

export interface ProjectStub {
  id: string
  name: string
  description: string
  billable: boolean
  employees: EmployeeWithInputs[]
  projectTotal: number
}

export interface BillingReportFormValues {
  startDate: Date
  endDate: Date
  client: string
  projects: string[]
  employees: string[]
}
