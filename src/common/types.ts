// Let's try to keep this sorted alphabethically to have some order here :)

import { FormikErrors, FormikTouched } from 'formik'

export interface BillingReportData {
  startDate: string
  endDate: string
  client: Client
  projects: ProjectStub[]
  creationMillis: number
  grandTotal: number
}

export interface SalaryReportData {
  startDate: string
  endDate: string
  employee: Employee
  clients: ClientWithProjectsAndInputs[]
  creationMillis: number
  grandTotal: number
}

export interface ClientWithProjectsAndInputs {
  id: string
  name: string
  clientTotal: number
  projects: ProjectWithInputsOfOneEmployee[]
}

export interface ProjectWithInputsOfOneEmployee {
  id: string
  name: string
  projectTotal: number
  timeInputs: TimeInput[]
}

export interface BillingReportFormValues {
  startDate: Date
  endDate: Date
  client: string
  projects: string[]
  employees: string[]
}
export interface Client {
  id: string
  name: string
  email?: string
}

export interface DateErrorProps {
  errors: FormikErrors<Date> | undefined
  touched: FormikTouched<Date> | undefined
}

export interface DateErrorsProps {
  errors: FormikErrors<BillingReportFormValues>
  touched: FormikTouched<BillingReportFormValues>
}

export interface DatePickerProps extends DateErrorProps {
  id: string | undefined
  label: React.ReactNode
  value: Date | null
  handleDateChange: (date: Date | null, value?: string | null | undefined) => void
}

export interface Employee {
  id: string
  username: string
  firstName: string
  lastName: string
}

export interface EmployeeWithInputs extends Employee {
  timeInputs: TimeInput[]
  employeeTotal: number
}

export interface FormikSetFieldValue {
  setFieldValue: (
    field: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void> | Promise<FormikErrors<BillingReportFormValues>>
}

export interface FormSelectItem {
  id: string
  name: string
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

export interface FormSelectMultipleWithButtonsProps extends FormikSetFieldValue {
  formSelectItems: FormSelectItem[]
  objects: (Project | Employee)[]
  handleBlur: (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  value: string[]
  errors: string | string[] | undefined
  touched: boolean | undefined
  label: string
  name: string
  className: string
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

export interface Input {
  time: string
  description: string
}

export interface InputWithId extends Input {
  id: string | null
}

export interface Manager {
  id: string
  username: string
  firstName: string
  lastName: string
}

export interface NotificationMessage {
  message: string | null
  severity: Severity
}

export interface OutlinedButtonProps {
  label: string
  handleClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
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
export interface ProjectStub {
  id: string
  name: string
  description: string
  billable: boolean
  employees: EmployeeWithInputs[]
  projectTotal: number
}

export interface SelectAllButtonProps extends UnselectAllButtonProps {
  objects: (Project | Employee)[]
}

export type Severity = 'error' | 'success' | 'info' | 'warning' | undefined

export interface SubmitButtonProps {
  className?: string
  disabled: boolean | undefined
  label: string
  testId?: string
}
export interface TimeInput {
  id: string
  input: number
  description: string
  date: string
  creationTimestamp: number
  lastEdited: number
}

export interface TimeInputsFormProps {
  projects: ProjectAndInputsWithId[]
  week: Date[]
  holidays: boolean[]
  debounceMs: number
  disableWeekChange: boolean
  showDescription: boolean
  setSaveMessage: React.Dispatch<React.SetStateAction<string>>
}

export interface TimeInputsRowProps {
  i: number
  project: ProjectAndInputs
  handleChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  handleBlur: (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  errors: FormikErrors<{ projects: ProjectAndInputs[] }>
  disable: boolean
  showDescription: boolean
  holidays: boolean[]
}

export interface TimeIntervalSelectsProps extends FormikSetFieldValue, DateErrorsProps {
  values: BillingReportFormValues
}

export interface UnselectAllButtonProps extends FormikSetFieldValue {
  label: string
  fieldName: string
}

export interface WeekRowProps {
  week: Date[]
  setWeek: React.Dispatch<React.SetStateAction<Date[]>>
  disableWeekChangeButtons: boolean
  setDisableWeekChange: React.Dispatch<React.SetStateAction<boolean>>
}
