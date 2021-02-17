import React from 'react'
import { act, fireEvent, render, RenderResult, waitFor } from '@testing-library/react'
import axios from 'axios'
import { I18nextProvider } from 'react-i18next'
import {
  formatDateFromDate,
  getFirstDayOfLastYear,
  getFirstDayOfMonth,
  getLastDayOfLastMonth,
  getLastDayOfLastYear,
} from '../../services/dateAndTimeService'
import i18n from '../../i18n'
import { t } from '../../testUtils/testUtils'
import * as projectTestUtils from '../../testUtils/projectTestUtils'
import { getEmployeeFullName } from '../../services/employeeService'

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
      if (url.includes('projects/employees')) {
        return Promise.resolve({ data: projectTestUtils.employees })
      }
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
    it('has client, projects and employees select fields, and start date and end date text fields', () => {
      const clientSelect = component.getByLabelText(t('client.label'))
      const projectSelect = component.getByLabelText(t('project.labelPlural'))
      const employeeSelect = component.getByLabelText(t('employee.labelPlural'))
      const startDateSelect = component.getByLabelText(t('startDate.label'))
      const endDateSelect = component.getByLabelText(t('endDate.label'))

      expect(clientSelect).toHaveAttribute('role', 'button')
      expect(projectSelect).toHaveAttribute('role', 'button')
      expect(employeeSelect).toHaveAttribute('role', 'button')
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

      const projectSelect = component.getByLabelText(t('project.labelPlural'))

      await act(async () => {
        fireEvent.mouseDown(projectSelect)
      })

      projectTestUtils.projects.forEach((project) => {
        expect(component.getByText(project.name)).toBeInTheDocument()
      })
    })

    it('has employee select containing fetched employees after client and projects are selected', async () => {
      await projectTestUtils.selectClient(component, projectTestUtils.clients[0])
      await component.findByText(projectTestUtils.clients[0].name)

      await projectTestUtils.selectProject(component, projectTestUtils.projects[0])
      await component.findAllByText(projectTestUtils.projects[0].name)

      const employeeSelect = component.getByLabelText(t('employee.labelPlural'))

      await act(async () => {
        fireEvent.mouseDown(employeeSelect)
      })

      projectTestUtils.employees.forEach((employee) => {
        expect(component.getByText(getEmployeeFullName(employee))).toBeInTheDocument()
      })
    })
  })

  describe('selecing projects and employees', () => {
    it('should select all projects with "select all projects" button', async () => {
      await projectTestUtils.selectClient(component, projectTestUtils.clients[0])
      await component.findByText(projectTestUtils.clients[0].name)

      const selectAllButton = component.getByText(t('project.selectAll'))
      await act(async () => {
        fireEvent.click(selectAllButton)
      })

      projectTestUtils.projects.forEach((project) => {
        expect(component.getByText(project.name)).toBeVisible()
      })
    })

    it('should unselect all projects with "unselect all projects" button', async () => {
      await projectTestUtils.selectClient(component, projectTestUtils.clients[0])
      await component.findByText(projectTestUtils.clients[0].name)

      const selectAllButton = component.getByText(t('project.selectAll'))
      await act(async () => {
        fireEvent.click(selectAllButton)
      })
      const unselectAllButton = component.getByText(t('project.unselectAll'))
      await act(async () => {
        fireEvent.click(unselectAllButton)
      })

      projectTestUtils.projects.forEach((project) => {
        expect(component.queryByText(project.name)).toBeNull()
      })
    })

    it('should selects all employees with "select all employees" button', async () => {
      await projectTestUtils.selectClient(component, projectTestUtils.clients[0])
      await component.findByText(projectTestUtils.clients[0].name)

      await projectTestUtils.selectProject(component, projectTestUtils.projects[0])
      await component.findAllByText(projectTestUtils.projects[0].name)

      const selectAllButton = component.getByText(t('employee.selectAll'))
      await act(async () => {
        fireEvent.click(selectAllButton)
      })

      projectTestUtils.employees.forEach((employee) => {
        expect(component.getByText(getEmployeeFullName(employee))).toBeVisible()
      })
    })

    it('should unselect all employees with "unselect all employees" button', async () => {
      await projectTestUtils.selectClient(component, projectTestUtils.clients[0])
      await component.findByText(projectTestUtils.clients[0].name)

      await projectTestUtils.selectProject(component, projectTestUtils.projects[0])
      await component.findAllByText(projectTestUtils.projects[0].name)

      const selectAllButton = component.getByText(t('employee.selectAll'))
      await act(async () => {
        fireEvent.click(selectAllButton)
      })
      const unselectAllButton = component.getByText(t('employee.unselectAll'))
      await act(async () => {
        fireEvent.click(unselectAllButton)
      })

      projectTestUtils.employees.forEach((employee) => {
        expect(component.queryByText(getEmployeeFullName(employee))).toBeNull()
      })
    })
  })

  describe('time interval select', () => {
    let startDateSelect: HTMLElement
    let endDateSelect: HTMLElement

    beforeEach(() => {
      startDateSelect = component.getByLabelText(t('startDate.label'))
      endDateSelect = component.getByLabelText(t('endDate.label'))
    })

    it('should have last month as preselected values', () => {
      const startDate = formatDateFromDate(getFirstDayOfMonth(1))
      const endDate = formatDateFromDate(getLastDayOfLastMonth())

      expect(startDateSelect).toHaveValue(startDate)
      expect(endDateSelect).toHaveValue(endDate)
    })

    it('should select last months with "last month" after first selecting some other interval', async () => {
      const lastTwoMonthsButton = component.getByText(t('button.lastTwoMonths'))
      await act(async () => {
        fireEvent.click(lastTwoMonthsButton)
      })
      const lastMonthButton = component.getByText(t('button.lastMonth'))
      await act(async () => {
        fireEvent.click(lastMonthButton)
      })

      const startDate = formatDateFromDate(getFirstDayOfMonth(1))
      const endDate = formatDateFromDate(getLastDayOfLastMonth())

      expect(startDateSelect).toHaveValue(startDate)
      expect(endDateSelect).toHaveValue(endDate)
    })

    it('should select last two months with "last two months" button', async () => {
      const lastTwoMonthsButton = component.getByText(t('button.lastTwoMonths'))
      await act(async () => {
        fireEvent.click(lastTwoMonthsButton)
      })

      const startDate = formatDateFromDate(getFirstDayOfMonth(2))
      const endDate = formatDateFromDate(getLastDayOfLastMonth())

      expect(startDateSelect).toHaveValue(startDate)
      expect(endDateSelect).toHaveValue(endDate)
    })

    it('should select last six months with "last six months" button', async () => {
      const lastSixMonthsButton = component.getByText(t('button.lastSixMonths'))
      await act(async () => {
        fireEvent.click(lastSixMonthsButton)
      })

      const startDate = formatDateFromDate(getFirstDayOfMonth(6))
      const endDate = formatDateFromDate(getLastDayOfLastMonth())

      expect(startDateSelect).toHaveValue(startDate)
      expect(endDateSelect).toHaveValue(endDate)
    })

    it('should select last year with "last year" button', async () => {
      const lastYearButton = component.getByText(t('button.lastYear'))
      await act(async () => {
        fireEvent.click(lastYearButton)
      })

      const startDate = formatDateFromDate(getFirstDayOfLastYear())
      const endDate = formatDateFromDate(getLastDayOfLastYear())

      expect(startDateSelect).toHaveValue(startDate)
      expect(endDateSelect).toHaveValue(endDate)
    })

    it('should be possible to type in any dates', async () => {
      const startDate = '15.06.2003'
      const endDate = '22.08.2005'

      await act(async () => {
        fireEvent.change(startDateSelect, { target: { value: startDate } })
        await component.findByDisplayValue(startDate)
      })

      await act(async () => {
        fireEvent.change(endDateSelect, { target: { value: endDate } })
        await component.findByDisplayValue(endDate)
      })

      expect(startDateSelect).toHaveValue(startDate)
      expect(endDateSelect).toHaveValue(endDate)
    })
  })

  describe('submitting with incorrect field values', () => {
    it('should display validation error for empty client select field', async () => {
      await pressGenerateButton()
      await waitFor(expect(component.getByText(t('client.error.chooseOne'))).toBeInTheDocument)
      expect(axios.post).toBeCalledTimes(0)
    })

    it('should display validation error for project field', async () => {
      await pressGenerateButton()
      await waitFor(expect(component.getByText(t('project.error.empty'))).toBeInTheDocument)
      expect(axios.post).toBeCalledTimes(0)
    })

    it('should display validation error for employee field', async () => {
      await pressGenerateButton()
      await waitFor(expect(component.getByText(t('employee.error.atLeastOne'))).toBeInTheDocument)
      expect(axios.post).toBeCalledTimes(0)
    })

    it('should display validation error when startDate is after endDate', async () => {
      const startDateSelect = component.getByLabelText(t('startDate.label'))
      const endDateSelect = component.getByLabelText(t('endDate.label'))

      const startDate = '01.01.2020'
      const endDate = '01.12.2019'

      await act(async () => {
        fireEvent.change(startDateSelect, { target: { value: startDate } })
        await component.findByDisplayValue(startDate)
      })

      await act(async () => {
        fireEvent.change(endDateSelect, { target: { value: endDate } })
        await component.findByDisplayValue(endDate)
      })

      await pressGenerateButton()
      await waitFor(expect(component.getByText(t('startDate.error'))).toBeInTheDocument)
      await waitFor(expect(component.getByText(t('endDate.error'))).toBeInTheDocument)
      expect(axios.post).toBeCalledTimes(0)
    })
  })
})
