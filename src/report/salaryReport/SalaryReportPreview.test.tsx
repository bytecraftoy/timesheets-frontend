import React from 'react'
import { act, render, RenderResult } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n'
import { t } from '../../testUtils/testUtils'
import { salaryReportData } from '../../testUtils/reportTestUtils'
import {
  formatDateFromString,
  formatDateFromStringWithWeekday,
  minutesToHoursAndMinutes,
} from '../../services/dateAndTimeService'
import { getEmployeeFullName } from '../../services/employeeService'
import SalaryReportPreview from './SalaryReportPreview'
import SalaryReportSummaryTable from './SalaryReportSummaryTable'
import SalaryReportDetailsTable from './SalaryReportDetailsTable'

let component: RenderResult

describe('SalaryReportSummaryTable', () => {
  const { clients } = salaryReportData
  const { grandTotal } = salaryReportData

  beforeEach(async () => {
    await act(async () => {
      component = render(
        <I18nextProvider i18n={i18n}>
          <SalaryReportSummaryTable clients={clients} grandTotal={grandTotal} />
        </I18nextProvider>
      )
      await component.findByText(t('report.preview.summary'))
    })
  })

  it('should render TableHeaderRow correctly', () => {
    expect(component.container).toHaveTextContent(t('client.label'))
    expect(component.container).toHaveTextContent(t('project.label'))
    expect(component.container).toHaveTextContent(t('timeInput.time.label'))
  })

  it('should render ClientRows correctly', () => {
    const client = salaryReportData.clients[0]
    expect(component.container).toHaveTextContent(client.name)
    expect(component.container).toHaveTextContent(minutesToHoursAndMinutes(client.clientTotal))
  })

  it('should render ProjectRow correctly', () => {
    const project = salaryReportData.clients[0].projects[0]
    expect(component.container).toHaveTextContent(project.name)
    expect(component.container).toHaveTextContent(minutesToHoursAndMinutes(project.projectTotal))
  })

  it('should render grandTotal correctly', () => {
    expect(component.container).toHaveTextContent(t('report.preview.grandTotal'))
    expect(component.container).toHaveTextContent(minutesToHoursAndMinutes(grandTotal))
  })
})

describe('SalaryReportDetailsTable', () => {
  const { clients } = salaryReportData

  beforeEach(async () => {
    await act(async () => {
      component = render(
        <I18nextProvider i18n={i18n}>
          <SalaryReportDetailsTable clients={clients} />
        </I18nextProvider>
      )
      await component.findByText(t('report.preview.details'))
    })
  })

  it('should render TableHeaderRow correctly', () => {
    expect(component.container).toHaveTextContent(t('client.label'))
    expect(component.container).toHaveTextContent(t('timeInput.time.label'))
  })

  it('should render TimeInputRow correctly', () => {
    const timeInput = clients[0].projects[0].timeInputs[0]

    expect(component.container).toHaveTextContent(formatDateFromStringWithWeekday(timeInput.date))
    expect(component.container).toHaveTextContent(minutesToHoursAndMinutes(timeInput.input))
    expect(component.container).toHaveTextContent(timeInput.description)
  })

  it('should render ProjectRow correctly', () => {
    const project = salaryReportData.clients[0].projects[0]
    expect(component.container).toHaveTextContent(project.name)
  })
})

describe('SalaryReportPreview', () => {
  beforeEach(async () => {
    await act(async () => {
      component = render(
        <I18nextProvider i18n={i18n}>
          <SalaryReportPreview data={salaryReportData} />
        </I18nextProvider>
      )
      await component.findByText(t('report.salary.preview.title'))
    })
  })

  it('should show employee name correctly', () => {
    const { employee } = salaryReportData
    expect(component.container).toHaveTextContent(getEmployeeFullName(employee))
  })

  it('should show report start and end date correctly', () => {
    expect(component.container).toHaveTextContent(formatDateFromString(salaryReportData.startDate))
    expect(component.container).toHaveTextContent(formatDateFromString(salaryReportData.endDate))
  })

  it('should have summary report section', () => {
    expect(component.container).toHaveTextContent(t('report.preview.summary'))
  })

  it('should have details report section', () => {
    expect(component.container).toHaveTextContent(t('report.preview.details'))
  })

  it('should render grandTotal correctly', () => {
    expect(component.container).toHaveTextContent(t('report.preview.grandTotal'))
    expect(component.container).toHaveTextContent(
      minutesToHoursAndMinutes(salaryReportData.grandTotal)
    )
  })
})
