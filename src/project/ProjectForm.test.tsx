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
import { getEmployeeFullName } from '../services/employeeService'

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
        if (url.includes('employees')) {
          return Promise.resolve({ data: projectTestUtils.employees })
        }
        return Promise.reject(new Error('not found'))
      })

      await act(async () => {
        component = render(
          <I18nextProvider i18n={i18n}>
            <ProjectForm />
          </I18nextProvider>
        )
        await component.findByText(t('project.createNew'))
      })
    })

    it('has name, description text fields, billabe info and employee, client & owner selects', () => {
      const nameInput = component.getByLabelText(t('project.form.nameLabel'))
      const desciptionInput = component.getByLabelText(t('project.description.label'))
      const clientSelect = component.getByLabelText(t('client.label'))
      const ownerSelect = component.getByLabelText(t('owner.label'))
      const billableCheckbox = component.getByLabelText(t('billable.label'))
      const employeeSelect = component.getByLabelText(t('employee.label'))

      expect(nameInput).toHaveAttribute('type', 'text')
      expect(desciptionInput).toBeInTheDocument()
      expect(billableCheckbox).toHaveAttribute('type', 'checkbox')
      expect(clientSelect).toHaveAttribute('role', 'button')
      expect(ownerSelect).toHaveAttribute('role', 'button')
      expect(employeeSelect).toHaveAttribute('role', 'button')
    })

    it('has employee, client and owner selects containing fetched employees, clients and managers', async () => {
      const clientSelect = component.getByLabelText(t('client.label'))
      const ownerSelect = component.getByLabelText(t('owner.label'))
      const employeeSelect = component.getByLabelText(t('employee.label'))

      await act(async () => {
        fireEvent.mouseDown(clientSelect)
        fireEvent.mouseDown(ownerSelect)
        fireEvent.mouseDown(employeeSelect)
      })

      projectTestUtils.clients.forEach((client) => {
        expect(component.getByText(client.name)).toBeInTheDocument()
      })

      projectTestUtils.managers.forEach((manager) => {
        expect(component.getByText(getEmployeeFullName(manager))).toBeInTheDocument()
      })

      projectTestUtils.employees.forEach((employee) => {
        expect(component.getByText(getEmployeeFullName(employee))).toBeInTheDocument()
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
        if (url.includes('employees')) {
          return Promise.resolve({ data: projectTestUtils.employees })
        }
        return Promise.reject(new Error('not found'))
      })

      await act(async () => {
        component = render(
          <I18nextProvider i18n={i18n}>
            <ProjectForm />
          </I18nextProvider>
        )
        await component.findByText(t('project.createNew'))
      })
    })

    describe('with empty values', () => {
      it('displays validation error name field cannot be empty', async () => {
        await projectTestUtils.selectClient(component, projectTestUtils.clients[0])
        await projectTestUtils.selectManager(component, projectTestUtils.managers[0])

        await pressSubmitButton()
        await waitFor(expect(component.getByText(t('project.error.name.empty'))).toBeInTheDocument)

        expect(axios.post).toBeCalledTimes(0)
      })

      it('displays validation error client select cannot be empty', async () => {
        await projectTestUtils.selectManager(component, projectTestUtils.managers[0])
        await projectTestUtils.changeNameInput(component, 'a')

        await pressSubmitButton()
        await waitFor(expect(component.getByText(t('client.error.chooseOne'))).toBeInTheDocument)
        expect(axios.post).toBeCalledTimes(0)
      })

      it('displays validation error owner select cannot be empty', async () => {
        await projectTestUtils.selectClient(component, projectTestUtils.clients[0])
        await projectTestUtils.changeNameInput(component, 'a')

        await pressSubmitButton()
        await waitFor(expect(component.getByText(t('owner.error'))).toBeInTheDocument)
        expect(axios.post).toBeCalledTimes(0)
      })
    })

    describe('with too long values', () => {
      it('displays validation error name field cannot be over 100 characters', async () => {
        await projectTestUtils.selectClient(component, projectTestUtils.clients[0])
        await projectTestUtils.selectManager(component, projectTestUtils.managers[0])
        await projectTestUtils.changeNameInput(component, 'a'.repeat(101))

        await pressSubmitButton()
        await waitFor(expect(component.getByText(t('project.error.tooLong'))).toBeInTheDocument)
        expect(axios.post).toBeCalledTimes(0)
      })

      it('displays validation error description field cannot be over 400 characters', async () => {
        await projectTestUtils.selectClient(component, projectTestUtils.clients[0])
        await projectTestUtils.selectManager(component, projectTestUtils.managers[0])
        await projectTestUtils.changeNameInput(component, 'a')
        await projectTestUtils.changeDesciptionInput(component, 'a'.repeat(401))

        await pressSubmitButton()
        await waitFor(expect(component.getByText(t('project.description.error'))).toBeInTheDocument)
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
      employees: projectTestUtils.employees.map((employee) => employee.id),
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
        if (url.includes('employees')) {
          return Promise.resolve({ data: projectTestUtils.employees })
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
        await component.findByText(t('project.createNew'))
      })

      await projectTestUtils.selectClient(component, projectTestUtils.clients[0])
      await projectTestUtils.selectManager(component, projectTestUtils.managers[0])
      await projectTestUtils.changeNameInput(component, newTestProjectJson.name)
      await projectTestUtils.changeDesciptionInput(component, newTestProjectJson.description)
      await projectTestUtils.selectEmployee(component, projectTestUtils.employees[0])
      await projectTestUtils.selectEmployee(component, projectTestUtils.employees[1])

      await pressSubmitButton()
      await component.findByText('Redirect')
    })

    it('the form should post correct json', () => {
      expect(axios.post).toBeCalledWith('/projects', newTestProjectJson)
    })
  })
})
