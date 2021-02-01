import React from 'react'
import { act, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import axios from 'axios'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import { t } from '../testUtils/testUtils'
import * as projectTestUtils from '../testUtils/projectTestUtils'

import BillingReportForm from './BillingReportForm'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

let component: RenderResult

const pressGenerateButton = async (): Promise<void> => {
  const submitButton = component.getByTestId('billingReportFormGenerate')
  await act(async () => {
    fireEvent.click(submitButton)
  })
}

describe('billing report form', () => {
  beforeEach(async () => {
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes('projects')) {
        return Promise.resolve({ data: projectTestUtils.projects })
      }
      if (url.includes('clients')) {
        return Promise.resolve({ data: projectTestUtils.clients })
      }
      return Promise.reject(new Error('not found'))
    })

    await act(async () => {
      component = render(
        <I18nextProvider i18n={i18n}>
          <BillingReportForm setReportData={jest.fn()} />
        </I18nextProvider>
      )
      await component.findByText(t('button.generate'))
    })
  })

  describe('empty form', () => {
    it('has client and projects select fields and start date and end date text fields', () => {
      const clientSelect = component.getByLabelText(t('client.label'))
      const projectSelect = component.getByLabelText(t('project.label'))
      const startDateSelect = component.getByLabelText(t('startDate.label'))
      const endDateSelect = component.getByLabelText(t('endDate.label'))

      expect(clientSelect).toHaveAttribute('role', 'button')
      expect(projectSelect).toHaveAttribute('role', 'button')
      expect(startDateSelect).toHaveAttribute('type', 'text')
      expect(endDateSelect).toHaveAttribute('type', 'text')
    })

    it('has client select containing fetched clients', async () => {
      const clientSelect = component.getByLabelText(t('client.label'))

      await act(async () => {
        fireEvent.mouseDown(clientSelect)
      })

      projectTestUtils.clients.forEach((client) => {
        expect(component.getByText(client.name)).toBeInTheDocument()
      })
    })

    it('has project select containing fetched projects after client is selected', async () => {
      await projectTestUtils.selectClient(component, projectTestUtils.clients[0])
      await component.findByText(projectTestUtils.clients[0].name)

      const projectSelect = component.getByLabelText(t('project.label'))

      await act(async () => {
        fireEvent.mouseDown(projectSelect)
      })

      projectTestUtils.projects.forEach((project) => {
        expect(component.getByText(project.name)).toBeInTheDocument()
      })
    })
  })

  describe('submitting with incorrect field values', () => {
    it('displays validation error for empty client select field', async () => {
      await pressGenerateButton()
      await waitFor(expect(component.getByText(t('client.error'))).toBeInTheDocument)
      expect(axios.post).toBeCalledTimes(0)
    })

    it('displays validation error for project field when client is not selected', async () => {
      await pressGenerateButton()
      await waitFor(expect(component.getByText(t('project.error.client'))).toBeInTheDocument)
      expect(axios.post).toBeCalledTimes(0)
    })

    it('displays validation error for project field when client is selected', async () => {
      await projectTestUtils.selectClient(component, projectTestUtils.clients[0])
      await pressGenerateButton()
      await waitFor(expect(component.getByText(t('project.error.empty'))).toBeInTheDocument)
      expect(axios.post).toBeCalledTimes(0)
    })
  })
})
