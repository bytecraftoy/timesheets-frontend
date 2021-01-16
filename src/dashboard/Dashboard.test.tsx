/* eslint-disable jest/no-disabled-tests */
import React from 'react'
import { act, fireEvent, render, RenderResult } from '@testing-library/react'
import axios from 'axios'
import { I18nextProvider } from 'react-i18next'
import { getISOWeek, addWeeks, subWeeks, format } from 'date-fns'
import i18n from '../i18n'
import { t } from '../testUtils/testUtils'
import { projects } from '../testUtils/projectTestUtils'
import { week, timeInputs } from '../testUtils/timeInputTestUtils'
import Dashboard from './Dashboard'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

let component: RenderResult
const monday: Date = week[0]

describe.skip('weekly view', () => {
  beforeEach(async () => {
    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes('hours')) {
        return Promise.resolve({ data: timeInputs })
      }
      if (url.includes('projects')) {
        return Promise.resolve({ data: projects })
      }
      return Promise.reject(new Error('not found'))
    })

    await act(async () => {
      component = render(
        <I18nextProvider i18n={i18n}>
          <Dashboard />
        </I18nextProvider>
      )
    })
    await component.findByText(t('inputHoursTitle'))
  })

  it('shows weekdays correctly', () => {
    expect(component.getByText(`Mon ${format(week[0], 'd.M.')}`)).toBeInTheDocument()
    expect(component.getByText(`Wed ${format(week[2], 'd.M.')}`)).toBeInTheDocument()
    expect(component.getByText(`Sun ${format(week[6], 'd.M.')}`)).toBeInTheDocument()
  })

  it('shows project name', () => {
    expect(component.getByText(projects[0].name)).toBeInTheDocument()
  })

  it('shows correct week number', () => {
    expect(component.getByText(`Week ${getISOWeek(monday).toString()}`)).toBeInTheDocument()
  })

  it('shows previous week correctly', async () => {
    const previousWeekButton = component.getByTestId('previousWeek')

    await act(async () => {
      fireEvent.click(previousWeekButton)
      await component.findByText(/week/i)
    })

    const previousMonday = subWeeks(monday, 1)
    const previousMondayString = `Mon ${format(previousMonday, 'd.M.')}`
    expect(component.getByText(`Week ${getISOWeek(previousMonday).toString()}`)).toBeInTheDocument()
    expect(component.getByText(previousMondayString)).toBeInTheDocument()
  })

  it('shows next week correctly', async () => {
    const nextWeekButton = component.getByTestId('nextWeek')

    await act(async () => {
      fireEvent.click(nextWeekButton)
      await component.findByText(/week/i)
    })

    const nextMonday = addWeeks(monday, 1)
    const nextMondayString = `Mon ${format(nextMonday, 'd.M.')}`
    expect(component.getByText(`Week ${getISOWeek(nextMonday).toString()}`)).toBeInTheDocument()
    expect(component.getByText(nextMondayString)).toBeInTheDocument()
  })
})
