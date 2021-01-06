import { RenderResult, fireEvent, act } from '@testing-library/react'
import { addDays, format, subDays, toDate } from 'date-fns'
import { Client, Manager, Project, TimeInput } from './common/types'
import { t } from './testUtils'

const project: Project = {
  id: '1',
  name: 'Bytecraft Timesheets project',
  description: 'Bytecraft Timesheets project',
  owner: {
    id: '5',
    username: 'A',
    firstName: 'A',
    lastName: 'A',
  },
  creator: {
    id: '5',
    username: 'A',
    firstName: 'A',
    lastName: 'A',
  },
  managers: [
    {
      id: '1',
      username: 'Manager1',
      firstName: 'Some',
      lastName: 'Manager',
    },
    {
      id: '2',
      username: 'Manager2',
      firstName: 'Another',
      lastName: 'Manager',
    },
  ],
  client: { id: '1', name: 'Bytecraft' },
  billable: true,
  employees: [
    {
      id: '3',
      username: 'dev3',
      firstName: 'Some',
      lastName: 'Developer',
    },
    {
      id: '4',
      username: 'dev4',
      firstName: 'Another',
      lastName: 'Developer',
    },
  ],
  tags: ['Back-end', 'Front-end', 'Fullstack', 'Planning'],
  creationTimestamp: 100000010000,
  lastEdited: 100000010010,
  lastEditor: {
    id: '1',
    username: 'Manager1',
    firstName: 'Some',
    lastName: 'Manager',
  },
}

const projects: Project[] = [
  {
    id: '1000',
    name: 'Projekti',
    description: '',
    client: { id: '1', name: 'Client 1' },
    owner: { id: '1', firstName: 'A', lastName: 'A', username: 'x' },
    creator: { id: '1', firstName: 'A', lastName: 'A', username: 'x' },
    managers: [{ id: '1', firstName: 'A', lastName: 'A', username: 'x' }],
    billable: true,
    employees: [],
    tags: ['front-end'],
    creationTimestamp: 1608652437257,
    lastEdited: 1608652437257,
    lastEditor: { id: '1', firstName: 'A', lastName: 'A', username: 'x' },
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
  },
  {
    id: '2',
    username: 'manager2',
    firstName: 'Some',
    lastName: 'Manager',
  },
  {
    id: '3',
    username: 'manager3',
    firstName: 'Other',
    lastName: 'Manager',
  },
]

const timeInputs: TimeInput[] = [
  {
    id: '1',
    input: 150,
    date: format(subDays(toDate(Date.now()), 1), 'yyyy-MM-dd'),
    creationTimestamp: 100000000000,
    lastEdited: 100000000000,
  },
  {
    id: '2',
    input: 450,
    date: format(toDate(Date.now()), 'yyyy-MM-dd'),
    creationTimestamp: 100000000000,
    lastEdited: 100000000000,
  },
  {
    id: '3',
    input: 300,
    date: format(addDays(toDate(Date.now()), 1), 'yyyy-MM-dd'),
    creationTimestamp: 100000000000,
    lastEdited: 100000000000,
  },
]

const selectClient = async (component: RenderResult, client: Client): Promise<void> => {
  const clientSelect = component.getByLabelText(t('projectFormClientLabel'))
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

const selectManager = async (component: RenderResult, manager: Manager): Promise<void> => {
  const ownerSelect = component.getByLabelText(t('projectFormOwnerLabel'))
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
  const nameInput = component.getByLabelText(t('projectFormNameLabel'))
  await act(async () => {
    fireEvent.change(nameInput, { target: { value } })
    await component.findByDisplayValue(value)
  })
}

const changeDesciptionInput = async (component: RenderResult, value: string): Promise<void> => {
  const desciptionInput = component.getByLabelText(t('projectFormDescriptionLabel'))
  await act(async () => {
    fireEvent.change(desciptionInput, { target: { value } })
    await component.findByDisplayValue(value)
  })
}

export {
  project,
  projects,
  managers,
  clients,
  selectClient,
  selectManager,
  changeNameInput,
  changeDesciptionInput,
  timeInputs,
}
