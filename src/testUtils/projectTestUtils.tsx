import { RenderResult, fireEvent, act } from '@testing-library/react'
import { Client, Employee, Manager, Project } from '../common/types'
import { t } from './testUtils'
import { getEmployeeFullName } from '../services/employeeService'

const projects: Project[] = [
  {
    id: '1000',
    name: 'Projekti',
    description: '',
    client: { id: '1', name: 'Client 1' },
    owner: { id: '1', firstName: 'A', lastName: 'A', username: 'x', isManager: true },
    creator: { id: '1', firstName: 'A', lastName: 'A', username: 'x', isManager: true },
    managers: [{ id: '1', firstName: 'A', lastName: 'A', username: 'x', isManager: true }],
    billable: true,
    employees: [],
    tags: ['front-end'],
    creationTimestamp: 1608652437257,
    lastEdited: 1608652437257,
    lastEditor: { id: '1', firstName: 'A', lastName: 'A', username: 'x', isManager: true },
  },
  {
    id: '1001',
    name: 'Toinen projekti',
    description: '',
    client: { id: '1', name: 'Client 1' },
    owner: { id: '1', firstName: 'A', lastName: 'A', username: 'x', isManager: true },
    creator: { id: '1', firstName: 'A', lastName: 'A', username: 'x', isManager: true },
    managers: [{ id: '1', firstName: 'A', lastName: 'A', username: 'x', isManager: true }],
    billable: true,
    employees: [],
    tags: ['front-end'],
    creationTimestamp: 1608652437257,
    lastEdited: 1608652437257,
    lastEditor: { id: '1', firstName: 'A', lastName: 'A', username: 'x', isManager: true },
  },
]

const employees: Employee[] = [
  {
    id: '3',
    username: 'dev3',
    firstName: 'Some',
    lastName: 'Developer',
    isManager: false,
  },
  {
    id: '4',
    username: 'dev4',
    firstName: 'Another',
    lastName: 'Developer',
    isManager: false,
  },
]

const clients: Client[] = [
  {
    id: '1',
    name: 'Client 1',
  },
  {
    id: '2',
    name: 'Client 2',
  },
  {
    id: '3',
    name: 'Client 3',
  },
]

const managers: Manager[] = [
  {
    id: '1',
    username: 'manager1',
    firstName: 'Another',
    lastName: 'Manager',
    isManager: true,
  },
  {
    id: '2',
    username: 'manager2',
    firstName: 'Some',
    lastName: 'Manager',
    isManager: true,
  },
  {
    id: '3',
    username: 'manager3',
    firstName: 'Other',
    lastName: 'Manager',
    isManager: true,
  },
]

const selectClient = async (component: RenderResult, client: Client): Promise<void> => {
  const clientSelect = component.getByLabelText(t('client.label'))
  let listbox: HTMLElement
  await act(async () => {
    fireEvent.mouseDown(clientSelect)
    listbox = await component.findByText(client.name)
  })
  await act(async () => {
    fireEvent.click(listbox)
    await component.findByText(client.name)
  })
}

const selectEmployee = async (component: RenderResult, employee: Employee): Promise<void> => {
  const employeeSelect = component.getByLabelText(t('employee.label'))
  let listbox: HTMLElement
  await act(async () => {
    fireEvent.mouseDown(employeeSelect)
    listbox = await component.findByText(getEmployeeFullName(employee))
  })
  await act(async () => {
    fireEvent.click(listbox)
    await component.findByText(getEmployeeFullName(employee))
  })
}

const selectProject = async (component: RenderResult, project: Project): Promise<void> => {
  const projectSelect = component.getByLabelText(t('project.labelPlural'))
  let listbox: HTMLElement
  await act(async () => {
    fireEvent.mouseDown(projectSelect)
    listbox = await component.findByText(project.name)
  })
  await act(async () => {
    fireEvent.click(listbox)
    await component.findByText(project.name)
  })
}

const selectManager = async (component: RenderResult, manager: Manager): Promise<void> => {
  const ownerSelect = component.getByLabelText(t('owner.label'))
  const value = `${manager.firstName} ${manager.lastName}`
  let listbox: HTMLElement
  await act(async () => {
    fireEvent.mouseDown(ownerSelect)
    listbox = await component.findByText(value)
  })
  await act(async () => {
    fireEvent.click(listbox)
    await component.findByText(value)
  })
}

const changeNameInput = async (component: RenderResult, value: string): Promise<void> => {
  const nameInput = component.getByLabelText(t('project.form.nameLabel'))
  await act(async () => {
    fireEvent.change(nameInput, { target: { value } })
    await component.findByDisplayValue(value)
  })
}

const changeDesciptionInput = async (component: RenderResult, value: string): Promise<void> => {
  const desciptionInput = component.getByLabelText(t('project.description.label'))
  await act(async () => {
    fireEvent.change(desciptionInput, { target: { value } })
    await component.findByDisplayValue(value)
  })
}

export {
  projects,
  employees,
  managers,
  clients,
  selectClient,
  selectEmployee,
  selectManager,
  selectProject,
  changeNameInput,
  changeDesciptionInput,
}
