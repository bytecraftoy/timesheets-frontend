// Let's try to keep this sorted alphabethically to have some order here :)

import { FormikErrors } from 'formik'

type Billable = {
  billable: boolean
  nonBillable: boolean
}

export interface Cost {
  value: number
  currency: string
}

type DatesAsStrings = {
  startDate: string
  endDate: string
}

type DatesAsDates = {
  startDate: Date
  endDate: Date
}

export type BillableCheckboxGroupProps = {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void
} & Billable

export type BillingReportData = {
  client: Client
  projects: ProjectStub[]
  created: number
  grandTotal: number
  grandTotalCost: Cost
} & Billable &
  DatesAsStrings

export type BillingReportFormValues = {
  startDate: Date
  endDate: Date
  client: string
  projects: string[]
  employees: string[]
} & Billable &
  DatesAsDates

export interface Client {
  id: string
  name: string
  email?: string
}

export interface ClientWithProjectsAndInputs {
  id: string
  name: string
  clientTotal: number
  clientTotalCost: Cost
  projects: ProjectWithInputsOfOneEmployee[]
}

export interface DateErrorProps {
  errors: FormikErrors<Date> | undefined
}

export interface DateErrorsProps {
  errors: FormikErrors<BillingReportFormValues>
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
  isManager: boolean
}

export interface EmployeeWithInputs extends Omit<Employee, 'isManager'> {
  timeInputs: TimeInputWithCost[]
  employeeTotal: number
  employeeTotalCost: Cost
}

type FormikHandleChangeAndBlur = {
  handleChange: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  handleBlur: (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => void
}

export interface FormikSetFieldValue {
  setFieldValue: (
    field: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void> | Promise<FormikErrors<BillingReportFormValues>>
}

export interface FormCheckboxProps {
  name: string
  checked: boolean
  handleChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void
  ariaLabel: string
  label: string
}
export interface FormSelectItem {
  id: string
  name: string
  isManager?: boolean
}
export interface FormSelectProps extends Omit<FormTextFieldProps, 'handleChange' | 'multiline'> {
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
  objects: (Project | Employee | Client)[]
  handleBlur: (e: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => void
  value: string[]
  errors: string | string[] | undefined
  touched: boolean | undefined
  label: string
  name: string
  className: string
}

export interface FormSwitchProps extends FormCheckboxProps {
  disabled?: boolean
}

export type FormTextFieldProps = {
  className?: string
  name: string
  label: string
  value: string
  errors: string | undefined
  touched: boolean | undefined
  multiline?: boolean
  InputProps?: { [key: string]: unknown }
} & FormikHandleChangeAndBlur
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

export type IsChangeWeekType = 'forward' | 'backward' | undefined

export type Manager = Employee

export interface NotificationMessage {
  message: string | null
  severity: Severity
}

export interface Project
  extends Omit<ProjectStub, 'employees' | 'projectTotal' | 'projectTotalCost'> {
  owner: Manager
  createdBy: Manager
  managers: Manager[]
  client: Client
  employees: Employee[]
  created: number
  edited: number
  editedBy: Manager
  hourlyCost: Cost
}

export interface ProjectFormValues {
  name: string
  description: string
  client: string
  owner: string
  billable: boolean
  employees: string[]
  hourlyCost: {
    value: string
    currency: string
  }
}

export interface ProjectUpdateValues extends ProjectFormValues {
  id: string
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
  projectTotalCost: Cost
}

export interface ProjectWithInputsOfOneEmployee {
  id: string
  name: string
  projectTotal: number
  projectTotalCost: Cost
  timeInputs: TimeInputWithCost[]
}

export type SalaryReportData = {
  employee: Employee
  clients: ClientWithProjectsAndInputs[]
  created: number
  grandTotal: number
  grandTotalCost: Cost
} & Billable &
  DatesAsStrings

export type SalaryReportFormValues = {
  employee: string
  clients: string[]
} & Billable &
  DatesAsDates

export interface SelectAllButtonProps extends UnselectAllButtonProps {
  objects: (Project | Employee | Client)[]
}

export type SetUserContextType = React.Dispatch<React.SetStateAction<UserContextType>>

export type Severity = 'error' | 'success' | 'info' | 'warning' | undefined

export interface SubmitButtonProps {
  className?: string
  disabled: boolean | undefined
  label: string
  testId?: string
}

export interface TableHeaderRowProps {
  leftLabel: string
  centerLabel: string
  currency?: string
}
export type TimeInput = {
  id: string
  input: number
  description: string
  date: string
  created: number
  edited: number
}

export interface TimeInputWithCost extends TimeInput {
  cost: Cost
}

export type TimeInputCellProps = {
  input: Input
  timeInputName: string
  errors: FormikErrors<{ projects: ProjectAndInputs[] }>
  showDescription: boolean
  isHoliday: boolean
  dataCy?: string
} & FormikHandleChangeAndBlur

export interface TimeInputsFormControlRowProps {
  disableShowDescription: boolean
  changeShowDescription: () => void
  showDescription: boolean
}

export interface TimeInputsFormProps {
  projectsAndInputs: ProjectAndInputsWithId[]
  week: Date[]
  holidays: boolean[]
  debounceMs: number
  showDescription: boolean
  setSaveMessage: React.Dispatch<React.SetStateAction<string>>
  setSaving: React.Dispatch<React.SetStateAction<boolean>>
}

export type TimeInputsRowProps = {
  i: number
  projectAndInputs: ProjectAndInputs
  errors: FormikErrors<{ projects: ProjectAndInputs[] }>
  showDescription: boolean
  holidays: boolean[]
} & FormikHandleChangeAndBlur

export interface TimeIntervalSelectsProps extends FormikSetFieldValue, DateErrorsProps {
  values: BillingReportFormValues | SalaryReportFormValues
}

export interface UnselectAllButtonProps extends FormikSetFieldValue {
  label: string
  fieldName: string
}

export type User = Employee | EmployeeWithInputs | UserContextType

export interface UserContextProps {
  user: UserContextType
  setUserContext: SetUserContextType
}

export type UserContextType = Employee

export interface WeekRowProps {
  week: Date[]
  disableWeekChangeButtons: boolean
  setChangeWeek: React.Dispatch<React.SetStateAction<IsChangeWeekType>>
}
