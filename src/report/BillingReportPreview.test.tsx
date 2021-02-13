import React from 'react'
import { act, render, RenderResult } from '@testing-library/react'
import { format, getDay } from 'date-fns'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import { t } from '../testUtils/testUtils'
import { billingReportData } from '../testUtils/reportTestUtils'

import BillingReportPreview from './BillingReportPreview'
import BillingReportSummaryTable from './BillingReportSummaryTable'
import { formatDateFromString, minutesToHoursAndMinutes } from '../services/dateAndTimeService'
import BillingReportDetailsTable from './BillingReportDetailsTable'
import { weekdays } from '../common/constants'

let component: RenderResult

describe('BillingReportSummaryTable', () => {
  const { projects } = billingReportData
  const { grandTotal } = billingReportData

  beforeEach(async () => {
    await act(async () => {
      component = render(
        <I18nextProvider i18n={i18n}>
          <BillingReportSummaryTable projects={projects} grandTotal={grandTotal} />
        </I18nextProvider>
      )
      await component.findByText(t('report.billing.preview.summary'))
    })
  })

  it('should render TableHeaderRow correctly', () => {
    expect(component.container).toHaveTextContent(t('project.label'))
    expect(component.container).toHaveTextContent(t('employee.label'))
    expect(component.container).toHaveTextContent(t('timeInput.time.label'))
  })

  it('should render EmployeeRow correctly', () => {
    const employee = billingReportData.projects[0].employees[0]
    expect(component.container).toHaveTextContent(`${employee.firstName} ${employee.lastName}`)
    expect(component.container).toHaveTextContent(minutesToHoursAndMinutes(employee.employeeTotal))
  })

  it('should render ProjectRows correctly', () => {
    const project = projects[0]
    expect(component.container).toHaveTextContent(project.name)
    expect(component.container).toHaveTextContent(t('report.billing.preview.subTotal'))
    expect(component.container).toHaveTextContent(minutesToHoursAndMinutes(project.projectTotal))
  })

  it('should render grandTotal correctly', () => {
    expect(component.container).toHaveTextContent(t('report.billing.preview.grandTotal'))
    expect(component.container).toHaveTextContent(minutesToHoursAndMinutes(grandTotal))
  })
})

describe('BillingReportDetailsTable', () => {
  const { projects } = billingReportData

  beforeEach(async () => {
    await act(async () => {
      component = render(
        <I18nextProvider i18n={i18n}>
          <BillingReportDetailsTable projects={projects} />
        </I18nextProvider>
      )
      await component.findByText(t('report.billing.preview.details'))
    })
  })

  it('should render TableHeaderRow correctly', () => {
    expect(component.container).toHaveTextContent(t('project.label'))
    expect(component.container).toHaveTextContent(t('employee.label'))
    expect(component.container).toHaveTextContent(t('timeInput.time.label'))
  })

  it('should render TimeInputRow correctly', () => {
    const timeInput = projects[0].employees[0].timeInputs[0]

    const formatDate = () => {
      const date = new Date(timeInput.date)
      const weekday = weekdays[getDay(date)]
      return `${weekday} ${format(date, 'd.M')}`
    }

    expect(component.container).toHaveTextContent(formatDate())
    expect(component.container).toHaveTextContent(minutesToHoursAndMinutes(timeInput.input))
    expect(component.container).toHaveTextContent(timeInput.description)
  })

  it('should render EmployeeRow correctly', () => {
    const employee = billingReportData.projects[0].employees[0]
    expect(component.container).toHaveTextContent(`${employee.firstName} ${employee.lastName}`)
  })
})

describe('BillingReportPreview', () => {
  beforeEach(async () => {
    await act(async () => {
      component = render(
        <I18nextProvider i18n={i18n}>
          <BillingReportPreview data={billingReportData} />
        </I18nextProvider>
      )
      await component.findByText(t('report.billing.preview.title'))
    })
  })

  it('should show client name correctly', () => {
    expect(component.container).toHaveTextContent(billingReportData.client.name)
  })

  it('should show report start and end date correctly', () => {
    expect(component.container).toHaveTextContent(formatDateFromString(billingReportData.startDate))
    expect(component.container).toHaveTextContent(formatDateFromString(billingReportData.endDate))
  })

  it('should have summary report section', () => {
    expect(component.container).toHaveTextContent(t('report.billing.preview.summary'))
  })

  it('should have details report section', () => {
    expect(component.container).toHaveTextContent(t('report.billing.preview.details'))
  })

  it('should render grandTotal correctly', () => {
    expect(component.container).toHaveTextContent(t('report.billing.preview.grandTotal'))
    expect(component.container).toHaveTextContent(
      minutesToHoursAndMinutes(billingReportData.grandTotal)
    )
  })
})
