import React from 'react'
import { fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import { BrowserRouter, Route } from 'react-router-dom'
import { act } from 'react-dom/test-utils'
import axios from 'axios'
import { RecoilRoot } from 'recoil'
import { I18nextProvider } from 'react-i18next'
import { t } from '../testUtils/testUtils'
import * as projectTestUtils from '../testUtils/projectTestUtils'
import i18n from '../i18n'
import ProjectForm from './ProjectForm'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

let component: RenderResult

describe('add project form', () => {
  const pressSubmitButton = async (): Promise<void> => {
    const submitButton = component.getByTestId('projectFormSubmit')
    await act(async () => {
      fireEvent.click(submitButton)
    })
  }

  describe('empty form', () => {
    beforeEach(async () => {
      mockedAxios.get.mockImplementation((url: string) => {
        if (url.includes('clients')) {
          return Promise.resolve({ data: projectTestUtils.clients })
        }
        if (url.includes('managers')) {
          return Promise.resolve({ data: projectTestUtils.managers })
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
      const clientSelect = component.getByLabelText(t('clientLabel'))
      const ownerSelect = component.getByLabelText(t('ownerLabel'))
      const billableCheckbox = component.getByLabelText(t('billableLabel'))

      expect(nameInput).toHaveAttribute('type', 'text')
      expect(desciptionInput).toHaveAttribute('type', 'text')
      expect(billableCheckbox).toHaveAttribute('type', 'checkbox')
      expect(clientSelect).toHaveAttribute('role', 'button')
      expect(ownerSelect).toHaveAttribute('role', 'button')
    })

    it('has client and owner selects containing fetched clients and managers', async () => {
      const clientSelect = component.getByLabelText(t('clientLabel'))
      const ownerSelect = component.getByLabelText(t('ownerLabel'))

      await act(async () => {
        fireEvent.mouseDown(clientSelect)
        fireEvent.mouseDown(ownerSelect)
      })

      projectTestUtils.clients.forEach((client) => {
        expect(component.getByText(client.name)).toBeInTheDocument()
      })

      projectTestUtils.managers.forEach((manager) => {
        expect(component.getByText(`${manager.firstName} ${manager.lastName}`)).toBeInTheDocument()
      })
    })
  })

  describe('submitting with incorrect field values', () => {
    beforeEach(async () => {
      mockedAxios.get.mockImplementation((url: string) => {
        if (url.includes('clients')) {
          return Promise.resolve({ data: projectTestUtils.clients })
        }
        if (url.includes('managers')) {
          return Promise.resolve({ data: projectTestUtils.managers })
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
        await projectTestUtils.selectClient(component, projectTestUtils.clients[0])
        await projectTestUtils.selectManager(component, projectTestUtils.managers[0])

        await pressSubmitButton()
        await waitFor(
          expect(component.getByText(t('projectFormEmptyNameErrorText'))).toBeInTheDocument
        )

        expect(axios.post).toBeCalledTimes(0)
      })

      it('displays validation error client select cannot be empty', async () => {
        await projectTestUtils.selectManager(component, projectTestUtils.managers[0])
        await projectTestUtils.changeNameInput(component, 'a')

        await pressSubmitButton()
        await waitFor(expect(component.getByText(t('emptyClientErrorText'))).toBeInTheDocument)
        expect(axios.post).toBeCalledTimes(0)
      })

      it('displays validation error owner select cannot be empty', async () => {
        await projectTestUtils.selectClient(component, projectTestUtils.clients[0])
        await projectTestUtils.changeNameInput(component, 'a')

        await pressSubmitButton()
        await waitFor(
          expect(component.getByText(t('projectFormEmptyOwnerErrorText'))).toBeInTheDocument
        )
        expect(axios.post).toBeCalledTimes(0)
      })
    })

    describe('with too long values', () => {
      it('displays validation error name field cannot be over 100 characters', async () => {
        await projectTestUtils.selectClient(component, projectTestUtils.clients[0])
        await projectTestUtils.selectManager(component, projectTestUtils.managers[0])
        await projectTestUtils.changeNameInput(component, 'a'.repeat(101))

        await pressSubmitButton()
        await waitFor(
          expect(component.getByText(t('projectFormTooLongNameErrorText'))).toBeInTheDocument
        )
        expect(axios.post).toBeCalledTimes(0)
      })

      it('displays validation error description field cannot be over 400 characters', async () => {
        await projectTestUtils.selectClient(component, projectTestUtils.clients[0])
        await projectTestUtils.selectManager(component, projectTestUtils.managers[0])
        await projectTestUtils.changeNameInput(component, 'a')
        await projectTestUtils.changeDesciptionInput(component, 'a'.repeat(401))

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
      client: projectTestUtils.clients[0].id,
      owner: projectTestUtils.managers[0].id,
      billable: true,
    }

    beforeEach(async () => {
      mockedAxios.get.mockImplementation((url: string) => {
        if (url.includes('clients')) {
          return Promise.resolve({ data: projectTestUtils.clients })
        }
        if (url.includes('managers')) {
          return Promise.resolve({ data: projectTestUtils.managers })
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

      await projectTestUtils.selectClient(component, projectTestUtils.clients[0])
      await projectTestUtils.selectManager(component, projectTestUtils.managers[0])
      await projectTestUtils.changeNameInput(component, newTestProjectJson.name)
      await projectTestUtils.changeDesciptionInput(component, newTestProjectJson.description)

      await pressSubmitButton()
      await component.findByText('Redirect')
    })

    it('the form should post correct json', () => {
      expect(axios.post).toBeCalledWith('undefined/projects', newTestProjectJson)
    })
  })
})
