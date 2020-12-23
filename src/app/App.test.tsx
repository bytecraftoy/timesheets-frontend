import React from 'react'
import { render, RenderResult, fireEvent, act } from '@testing-library/react'
import axios from 'axios'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import { t } from '../testUtils'

import App from './App'
import { Client, Manager, Project } from '../common/types'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

let app: RenderResult

const projects: Project[] = [
  {
    id: 1000,
    name: 'Projekti',
    description: '',
    client: { id: 1, name: 'Client 1' },
    owner: { id: 1, firstName: 'A', lastName: 'A', username: 'x' },
    creator: { id: 1, firstName: 'A', lastName: 'A', username: 'x' },
    managers: [{ id: 1, firstName: 'A', lastName: 'A', username: 'x' }],
    billable: true,
    employees: [],
    tags: ['front-end'],
    creationTimestamp: 1608652437257,
    lastEdited: 1608652437257,
    lastEditor: { id: 1, firstName: 'A', lastName: 'A', username: 'x' },
  },
]

const clients: Client[] = [
  {
    id: 1,
    name: 'Client 1',
  },
]
const managers: Manager[] = [
  {
    id: 1,
    username: 'manager1',
    firstName: 'Another',
    lastName: 'Manager',
  },
]

const selectClient = async (client: Client): Promise<void> => {
  const clientSelect = app.getByLabelText(t('projectFormClientLabel'))
  let listbox: HTMLElement
  await act(async () => {
    fireEvent.mouseDown(clientSelect)
    listbox = await app.findByText(client.name)
  })
  await act(async () => {
    fireEvent.click(listbox)
    await app.findByText(client.name)
  })
}

const selectManager = async (manager: Manager): Promise<void> => {
  const ownerSelect = app.getByLabelText(t('projectFormOwnerLabel'))
  const value = `${manager.firstName} ${manager.lastName}`
  let listbox: HTMLElement
  await act(async () => {
    fireEvent.mouseDown(ownerSelect)
    listbox = await app.findByText(value)
  })
  await act(async () => {
    fireEvent.click(listbox)
    await app.findByText(value)
  })
}

const changeNameInput = async (value: string): Promise<void> => {
  const nameInput = app.getByLabelText(t('projectFormNameLabel'))
  await act(async () => {
    fireEvent.change(nameInput, { target: { value } })
    await app.findByDisplayValue(value)
  })
}

describe('app', () => {
  beforeEach(() => {
    app = render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    )
  })

  it('should display timesheets title', () => {
    const appTitle = app.getByText(t('appTitle'))
    expect(appTitle).toBeInTheDocument()
  })

  it('should display navigation link to projects view', () => {
    const projectsTitle = app.getByText(t('projectsTitle'))
    expect(projectsTitle).toBeInTheDocument()
  })
})

describe('projects', () => {
  beforeEach(async () => {
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes('clients')) {
        return Promise.resolve({ data: clients })
      }
      if (url.includes('managers')) {
        return Promise.resolve({ data: managers })
      }
      if (url.includes('projects')) {
        return Promise.resolve({ data: projects })
      }
      return Promise.reject(new Error('not found'))
    })

    await act(async () => {
      app = render(
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      )
      await app.findByText(t('appTitle'))
    })
  })

  describe('when navigating into projects', () => {
    beforeEach(async () => {
      const projectLink = app.getByTestId('projects-link')

      await act(async () => {
        fireEvent.click(projectLink)
        await app.findByText(/add project/i)
      })
    })

    it("should display user's projects", () => {
      expect(app.getByText(projects[0].name)).toBeInTheDocument()
    })

    describe('when adding a project', () => {
      const newProjectName = 'Testproject'

      beforeEach(async () => {
        await act(async () => {
          const addProjectButton = app.getByText(/add project/i)
          fireEvent.click(addProjectButton)
        })

        mockedAxios.post.mockImplementationOnce((url: string) => {
          if (url.includes('projects')) {
            return Promise.resolve({ data: { name: newProjectName } })
          }
          return Promise.reject(new Error('not found'))
        })

        await app.findByText(/create new project/i)

        await act(async () => {
          await changeNameInput(newProjectName)
          await selectClient(clients[0])
          await selectManager(managers[0])

          const submitButton = app.getByText(t('projectFormCreateButtonText'))
          fireEvent.click(submitButton)
        })

        await app.findByText(/add project/i)
      })

      it('should display notification after successful project add', async () => {
        expect(app.getByText(`${newProjectName} created succesfully!`)).toBeInTheDocument()
      })
    })
  })
})
