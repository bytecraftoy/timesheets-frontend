import React from 'react'
import { fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import { BrowserRouter, Route } from 'react-router-dom'
import { act } from 'react-dom/test-utils'
import axios from 'axios'
import { RecoilRoot } from 'recoil'
import { I18nextProvider } from 'react-i18next'
import { t } from '../testUtils'
import i18n from '../i18n'
import ProjectForm from './ProjectForm'
import { Client, Manager } from '../common/types'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

let component: RenderResult

describe('add project form', () => {
  const selectClient = async (client: Client): Promise<void> => {
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

  const selectManager = async (manager: Manager): Promise<void> => {
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

  const changeNameInput = async (value: string): Promise<void> => {
    const nameInput = component.getByLabelText(t('projectFormNameLabel'))
    await act(async () => {
      fireEvent.change(nameInput, { target: { value } })
      await component.findByDisplayValue(value)
    })
  }

  const changeDesciptionInput = async (value: string): Promise<void> => {
    const desciptionInput = component.getByLabelText(t('projectFormDescriptionLabel'))
    await act(async () => {
      fireEvent.change(desciptionInput, { target: { value } })
      await component.findByDisplayValue(value)
    })
  }

  const pressSubmitButton = async (): Promise<void> => {
    const submitButton = component.getByTestId('projectFormSubmit')
    await act(async () => {
      fireEvent.click(submitButton)
    })
  }

  const clients: Client[] = [
    {
      id: 1,
      name: 'Client 1',
    },
    {
      id: 2,
      name: 'Client 2',
    },
    {
      id: 3,
      name: 'Client 3',
    },
  ]
  const managers: Manager[] = [
    {
      id: 1,
      username: 'manager1',
      firstName: 'Another',
      lastName: 'Manager',
    },
    {
      id: 2,
      username: 'manager2',
      firstName: 'Some',
      lastName: 'Manager',
    },
    {
      id: 3,
      username: 'manager3',
      firstName: 'Other',
      lastName: 'Manager',
    },
  ]

  describe('empty form', () => {
    beforeEach(async () => {
      mockedAxios.get.mockImplementation((url: string) => {
        if (url.includes('clients')) {
          return Promise.resolve({ data: clients })
        }
        if (url.includes('managers')) {
          return Promise.resolve({ data: managers })
        }
        return Promise.reject(new Error('not found'))
      })

      await act(async () => {
        component = render(
          <I18nextProvider i18n={i18n}>
            <ProjectForm />
          </I18nextProvider>
        )
        await component.findByText(t('projectFormHeading'))
      })
    })

    it('has name, description text fields, billabe info and client & owner selects', () => {
      const nameInput = component.getByLabelText(t('projectFormNameLabel'))
      const desciptionInput = component.getByLabelText(t('projectFormDescriptionLabel'))
      const clientSelect = component.getByLabelText(t('projectFormClientLabel'))
      const ownerSelect = component.getByLabelText(t('projectFormOwnerLabel'))
      const billableCheckbox = component.getByLabelText(t('projectFormBillableLabel'))

      expect(nameInput).toHaveAttribute('type', 'text')
      expect(desciptionInput).toHaveAttribute('type', 'text')
      expect(billableCheckbox).toHaveAttribute('type', 'checkbox')
      expect(clientSelect).toHaveAttribute('role', 'button')
      expect(ownerSelect).toHaveAttribute('role', 'button')
    })

    it('has client and owner selects containing fetched clients and managers', async () => {
      const clientSelect = component.getByLabelText(t('projectFormClientLabel'))
      const ownerSelect = component.getByLabelText(t('projectFormOwnerLabel'))

      await act(async () => {
        fireEvent.mouseDown(clientSelect)
        fireEvent.mouseDown(ownerSelect)
      })

      clients.forEach((client) => {
        expect(component.getByText(client.name)).toBeInTheDocument()
      })

      managers.forEach((manager) => {
        expect(component.getByText(`${manager.firstName} ${manager.lastName}`)).toBeInTheDocument()
      })
    })
  })

  describe('submitting with incorrect field values', () => {
    beforeEach(async () => {
      mockedAxios.get.mockImplementation((url: string) => {
        if (url.includes('clients')) {
          return Promise.resolve({ data: clients })
        }
        if (url.includes('managers')) {
          return Promise.resolve({ data: managers })
        }
        return Promise.reject(new Error('not found'))
      })

      await act(async () => {
        component = render(
          <I18nextProvider i18n={i18n}>
            <ProjectForm />
          </I18nextProvider>
        )
        await component.findByText(t('projectFormHeading'))
      })
    })

    describe('with empty values', () => {
      it('displays validation error name field cannot be empty', async () => {
        await selectClient(clients[0])
        await selectManager(managers[0])

        await pressSubmitButton()
        await waitFor(
          expect(component.getByText(t('projectFormEmptyNameErrorText'))).toBeInTheDocument
        )

        expect(axios.post).toBeCalledTimes(0)
      })

      it('displays validation error client select cannot be empty', async () => {
        await selectManager(managers[0])
        await changeNameInput('a')

        await pressSubmitButton()
        await waitFor(
          expect(component.getByText(t('projectFormEmptyClientErrorText'))).toBeInTheDocument
        )
        expect(axios.post).toBeCalledTimes(0)
      })

      it('displays validation error owner select cannot be empty', async () => {
        await selectClient(clients[0])
        await changeNameInput('a')

        await pressSubmitButton()
        await waitFor(
          expect(component.getByText(t('projectFormEmptyOwnerErrorText'))).toBeInTheDocument
        )
        expect(axios.post).toBeCalledTimes(0)
      })
    })

    describe('with too long values', () => {
      it('displays validation error name field cannot be over 100 characters', async () => {
        await selectClient(clients[0])
        await selectManager(managers[0])
        await changeNameInput('a'.repeat(101))

        await pressSubmitButton()
        await waitFor(
          expect(component.getByText(t('projectFormTooLongNameErrorText'))).toBeInTheDocument
        )
        expect(axios.post).toBeCalledTimes(0)
      })

      it('displays validation error description field cannot be over 400 characters', async () => {
        await selectClient(clients[0])
        await selectManager(managers[0])
        await changeNameInput('a')
        await changeDesciptionInput('a'.repeat(401))

        await pressSubmitButton()
        await waitFor(
          expect(component.getByText(t('projectFormTooLongDescriptionErrorText'))).toBeInTheDocument
        )
        expect(axios.post).toBeCalledTimes(0)
      })
    })
  })

  describe('submitting with correct field values', () => {
    const newTestProjectJson = {
      name: 'a',
      description: 'a',
      client: clients[0].id,
      owner: managers[0].id,
      billable: true,
    }

    beforeEach(async () => {
      mockedAxios.get.mockImplementation((url: string) => {
        if (url.includes('clients')) {
          return Promise.resolve({ data: clients })
        }
        if (url.includes('managers')) {
          return Promise.resolve({ data: managers })
        }
        return Promise.reject(new Error('not found'))
      })

      mockedAxios.post.mockImplementationOnce((url: string) => {
        if (url.includes('projects')) {
          return Promise.resolve({ data: { name: newTestProjectJson.name } })
        }
        return Promise.reject(new Error('not found'))
      })

      await act(async () => {
        component = render(
          <I18nextProvider i18n={i18n}>
            <RecoilRoot>
              <BrowserRouter>
                <ProjectForm />
                <Route path="/projects">Redirect</Route>
              </BrowserRouter>
            </RecoilRoot>
          </I18nextProvider>
        )
        await component.findByText(t('projectFormHeading'))
      })

      await selectClient(clients[0])
      await selectManager(managers[0])
      await changeNameInput(newTestProjectJson.name)
      await changeDesciptionInput(newTestProjectJson.description)

      await pressSubmitButton()
      await component.findByText('Redirect')
    })

    it('the form should post correct json', () => {
      expect(axios.post).toBeCalledWith('undefined/projects', newTestProjectJson)
    })
  })
})
