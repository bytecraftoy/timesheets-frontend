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
import SalaryReportForm from './SalaryReportForm'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

let component: RenderResult

const pressGenerateButton = async (): Promise<void> => {
  const submitButton = component.getByTestId('salaryReportFormGenerate')
  await act(async () => {
    fireEvent.click(submitButton)
  })
}

describe('salary report form', () => {
  beforeEach(async () => {
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes('employees')) {
        return Promise.resolve({ data: projectTestUtils.employees })
      }
      if (url.includes('clients')) {
        return Promise.resolve({ data: projectTestUtils.clients })
      }
      return Promise.reject(new Error('not found'))
    })

    await act(async () => {
      component = render(
        <I18nextProvider i18n={i18n}>
          <SalaryReportForm setReportData={jest.fn()} />
        </I18nextProvider>
      )
      await component.findByText(t('button.generate'))
    })
  })

  describe('empty form', () => {
    it('has employee and clients select fields, and start date and end date text fields', () => {
      const employeeSelect = component.getByLabelText(t('employee.label'))
      const clientSelect = component.getByLabelText(t('client.label_plural'))
      const startDateSelect = component.getByLabelText(t('startDate.label'))
      const endDateSelect = component.getByLabelText(t('endDate.label'))

      expect(clientSelect).toHaveAttribute('role', 'button')
      expect(employeeSelect).toHaveAttribute('role', 'button')
      expect(startDateSelect).toHaveAttribute('type', 'text')
      expect(endDateSelect).toHaveAttribute('type', 'text')
    })

    it('has employee select containing fetched employees', async () => {
      const employeeSelect = component.getByLabelText(t('employee.label'))

      await act(async () => {
        fireEvent.mouseDown(employeeSelect)
      })

      projectTestUtils.employees.forEach((employee) => {
        expect(
          component.getByText(`${employee.firstName} ${employee.lastName}`)
        ).toBeInTheDocument()
      })
    })

    it('has client select containing fetched clients after employee is selected', async () => {
      const employee = projectTestUtils.employees[0]
      await projectTestUtils.selectEmployee(component, employee)
      await component.findByText(`${employee.firstName} ${employee.lastName}`)

      const clientSelect = component.getByLabelText(t('client.label_plural'))

      await act(async () => {
        fireEvent.mouseDown(clientSelect)
      })

      projectTestUtils.clients.forEach((client) => {
        expect(component.getByText(client.name)).toBeInTheDocument()
      })
    })
  })

  describe('selecing projects and employees', () => {
    it('should select all clients with "select all clients" button', async () => {
      const employee = projectTestUtils.employees[0]
      await projectTestUtils.selectEmployee(component, employee)
      await component.findByText(`${employee.firstName} ${employee.lastName}`)

      const selectAllButton = component.getByText(t('client.selectAll'))
      await act(async () => {
        fireEvent.click(selectAllButton)
      })

      projectTestUtils.clients.forEach((client) => {
        expect(component.getByText(client.name)).toBeVisible()
      })
    })

    it('should unselect all projects with "unselect all projects" button', async () => {
      const employee = projectTestUtils.employees[0]
      await projectTestUtils.selectEmployee(component, employee)
      await component.findByText(`${employee.firstName} ${employee.lastName}`)

      const selectAllButton = component.getByText(t('client.selectAll'))
      await act(async () => {
        fireEvent.click(selectAllButton)
      })
      const unselectAllButton = component.getByText(t('client.unselectAll'))
      await act(async () => {
        fireEvent.click(unselectAllButton)
      })

      projectTestUtils.projects.forEach((client) => {
        expect(component.queryByText(client.name)).toBeNull()
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
    it('should display validation error for empty employee select field', async () => {
      await pressGenerateButton()
      await waitFor(expect(component.getByText(t('employee.error.chooseOne'))).toBeInTheDocument)
      expect(axios.post).toBeCalledTimes(0)
    })

    it('should display validation error for client field', async () => {
      await pressGenerateButton()
      await waitFor(expect(component.getByText(t('client.error.atLeastOne'))).toBeInTheDocument)
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
