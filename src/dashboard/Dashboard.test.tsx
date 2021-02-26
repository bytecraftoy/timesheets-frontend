import React from 'react'
import { act, fireEvent, render, RenderResult } from '@testing-library/react'
import axios from 'axios'
import { I18nextProvider } from 'react-i18next'
import { getISOWeek, addWeeks, subWeeks, format, isSameDay } from 'date-fns'
import { Hours, HoursUpdate } from '../common/types'
import { minutesToHoursAndMinutes } from './DashboardService'
import i18n from '../i18n'
import { t } from '../testUtils/testUtils'
import { projects } from '../testUtils/projectTestUtils'
import {
  week,
  timeInputs1,
  timeInputs2,
  clickShowDescriptionSwitch,
  changeFirstTimeInput,
  changeFirstDescriptionInput,
} from '../testUtils/timeInputTestUtils'
import Dashboard from './Dashboard'

jest.mock('axios')

const mockedAxios = axios as jest.Mocked<typeof axios>

let component: RenderResult
const monday: Date = week[0]

const debounceMs = 1

describe('weekly view', () => {
  describe('empty dashboard', () => {
    beforeEach(async () => {
      mockedAxios.get.mockImplementation(() => Promise.resolve({ data: [] }))

      await act(async () => {
        component = render(
          <I18nextProvider i18n={i18n}>
            <Dashboard debounceMs={debounceMs} />
          </I18nextProvider>
        )
      })
      await component.findByText(t('timeInputs.title'))
    })

    it('shows weekdays correctly', () => {
      expect(component.getByText(`Mon ${format(week[0], 'd.M.')}`)).toBeInTheDocument()
      expect(component.getByText(`Wed ${format(week[2], 'd.M.')}`)).toBeInTheDocument()
      expect(component.getByText(`Sun ${format(week[6], 'd.M.')}`)).toBeInTheDocument()
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
      expect(
        component.getByText(`Week ${getISOWeek(previousMonday).toString()}`)
      ).toBeInTheDocument()
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

    it('shows show description switch', () => {
      const showDescriptionCheckbox = component.getByLabelText(t('project.description.label'))
      expect(showDescriptionCheckbox).toHaveAttribute('type', 'checkbox')
    })
  })

  describe('dashboard with projects', () => {
    beforeEach(async () => {
      mockedAxios.get.mockImplementation((url: string) => {
        if (url.includes('hours')) {
          if (url.includes(projects[0].id)) {
            return Promise.resolve({ data: timeInputs1 })
          }
          if (url.includes(projects[1].id)) {
            return Promise.resolve({ data: timeInputs2 })
          }
          return Promise.resolve({ data: [] })
        }
        if (url.includes('projects')) {
          return Promise.resolve({ data: projects })
        }
        return Promise.reject(new Error('not found'))
      })

      await act(async () => {
        component = render(
          <I18nextProvider i18n={i18n}>
            <Dashboard debounceMs={debounceMs} />
          </I18nextProvider>
        )
      })
      await component.findByText(t('timeInputs.title'))
    })

    it("shows projects' names", () => {
      projects.forEach((project) => {
        expect(component.getByText(project.name)).toBeInTheDocument()
      })
    })

    it('shows seven time fields for each project', () => {
      for (let i = 0; i < projects.length; i += 1) {
        for (let j = 0; j < 7; j += 1) {
          expect(component.getByTestId(`projects[${i}].inputs[${j}].time`)).toBeInTheDocument()
        }
      }
    })

    it('shows seven description fields for each project', async () => {
      await clickShowDescriptionSwitch(component)
      for (let i = 0; i < projects.length; i += 1) {
        for (let j = 0; j < 7; j += 1) {
          expect(
            component.getByTestId(`projects[${i}].inputs[${j}].description`)
          ).toBeInTheDocument()
        }
      }
    })

    it('shows saved times for the correct day and project', () => {
      timeInputs1.forEach((timeInput) => {
        expect(
          component.getByDisplayValue(minutesToHoursAndMinutes(timeInput.input))
        ).toHaveAttribute(
          'name',
          `projects[${projects.indexOf(projects[0])}].inputs[${week.findIndex((day) =>
            isSameDay(new Date(timeInput.date), day)
          )}].time`
        )
      })
      timeInputs2.forEach((timeInput) => {
        expect(
          component.getByDisplayValue(minutesToHoursAndMinutes(timeInput.input))
        ).toHaveAttribute(
          'name',
          `projects[${projects.indexOf(projects[1])}].inputs[${week.findIndex((day) =>
            isSameDay(new Date(timeInput.date), day)
          )}].time`
        )
      })
    })

    it('shows saved descriptions for the correct day and project', async () => {
      await clickShowDescriptionSwitch(component)
      timeInputs1
        .filter((timeInput) => timeInput.description !== '')
        .forEach((timeInput) => {
          expect(component.getByDisplayValue(timeInput.description)).toHaveAttribute(
            'name',
            `projects[${projects.indexOf(projects[0])}].inputs[${week.findIndex((day) =>
              isSameDay(new Date(timeInput.date), day)
            )}].description`
          )
        })
      timeInputs2
        .filter((timeInput) => timeInput.description !== '')
        .forEach((timeInput) => {
          expect(component.getByDisplayValue(timeInput.description)).toHaveAttribute(
            'name',
            `projects[${projects.indexOf(projects[1])}].inputs[${week.findIndex((day) =>
              isSameDay(new Date(timeInput.date), day)
            )}].description`
          )
        })
    })
  })

  describe('writing incorrect field values', () => {
    beforeEach(async () => {
      mockedAxios.get.mockImplementation((url: string) => {
        if (url.includes('hours')) {
          return Promise.resolve({ data: timeInputs1 })
        }
        if (url.includes('projects')) {
          return Promise.resolve({ data: projects })
        }
        return Promise.reject(new Error('not found'))
      })

      await act(async () => {
        component = render(
          <I18nextProvider i18n={i18n}>
            <Dashboard debounceMs={debounceMs} />
          </I18nextProvider>
        )
      })
      await component.findByText(t('timeInputs.title'))
    })

    describe('with incorrect time input', () => {
      it('displays validation error time input must be formated correctly', async () => {
        await changeFirstTimeInput(component, '2hh4')
        expect(
          await component.findByText(t('timeInput.time.error.format'), { exact: false })
        ).toBeInTheDocument()
        await changeFirstTimeInput(component, '2h4m1')
        expect(
          await component.findByText(t('timeInput.time.error.format'), { exact: false })
        ).toBeInTheDocument()
        await changeFirstTimeInput(component, '23h2hh4')
        expect(
          await component.findByText(t('timeInput.time.error.format'), { exact: false })
        ).toBeInTheDocument()
        await changeFirstTimeInput(component, '2h-60min')
        expect(
          await component.findByText(t('timeInput.time.error.format'), { exact: false })
        ).toBeInTheDocument()
        await changeFirstTimeInput(component, '2 :30')
        expect(
          await component.findByText(t('timeInput.time.error.format'), { exact: false })
        ).toBeInTheDocument()
        await changeFirstTimeInput(component, '1; 2')
        expect(
          await component.findByText(t('timeInput.time.error.format'), { exact: false })
        ).toBeInTheDocument()
        await changeFirstTimeInput(component, '-110min')
        expect(
          await component.findByText(t('timeInput.time.error.format'), { exact: false })
        ).toBeInTheDocument()
        expect(axios.post).toBeCalledTimes(0)
        expect(axios.put).toBeCalledTimes(0)
      })

      it('displays validation error time input cannot be negative', async () => {
        await changeFirstTimeInput(component, '-2')
        expect(
          await component.findByText(t('timeInput.time.error.negative'), { exact: false })
        ).toBeInTheDocument()
        expect(axios.post).toBeCalledTimes(0)
        expect(axios.put).toBeCalledTimes(0)
      })

      it('displays validation error time input cannot be over 24 hours', async () => {
        await changeFirstTimeInput(component, '25')
        expect(
          await component.findByText(t('timeInput.time.error.over24'), { exact: false })
        ).toBeInTheDocument()
        expect(axios.post).toBeCalledTimes(0)
        expect(axios.put).toBeCalledTimes(0)
      })
    })

    describe('with incorrect description input', () => {
      it('displays validation error description input cannot be over 100 characters', async () => {
        await clickShowDescriptionSwitch(component)
        await changeFirstDescriptionInput(component, 'a'.repeat(101))
        expect(
          await component.findByText(t('timeInput.description.error.tooLong'), { exact: false })
        ).toBeInTheDocument()
        expect(axios.post).toBeCalledTimes(0)
        expect(axios.put).toBeCalledTimes(0)
      })
    })
  })
  describe('writing description but leaving time input empty', () => {
    beforeEach(async () => {
      mockedAxios.get.mockImplementation((url: string) => {
        if (url.includes('hours')) {
          return Promise.resolve({ data: [] })
        }
        if (url.includes('projects')) {
          return Promise.resolve({ data: projects })
        }
        return Promise.reject(new Error('not found'))
      })

      await act(async () => {
        component = render(
          <I18nextProvider i18n={i18n}>
            <Dashboard debounceMs={debounceMs} />
          </I18nextProvider>
        )
      })
      await component.findByText(t('timeInputs.title'))
    })

    it('displays validation error time input cannot be empty', async () => {
      await clickShowDescriptionSwitch(component)
      await changeFirstDescriptionInput(component, 'a')
      expect(
        await component.findByText(t('timeInput.time.error.empty'), { exact: false })
      ).toBeInTheDocument()
      expect(axios.post).toBeCalledTimes(0)
      expect(axios.put).toBeCalledTimes(0)
    })
  })
  describe('writing new time input with correct field values', () => {
    beforeEach(async () => {
      mockedAxios.get.mockImplementation((url: string) => {
        if (url.includes('hours')) {
          return Promise.resolve({ data: [] })
        }
        if (url.includes('projects')) {
          return Promise.resolve({ data: projects })
        }
        return Promise.reject(new Error('not found'))
      })
      mockedAxios.post.mockImplementationOnce((url: string) => {
        if (url.includes('hours')) {
          return Promise.resolve({ data: { id: '1' } })
        }
        return Promise.reject(new Error('not found'))
      })

      await act(async () => {
        component = render(
          <I18nextProvider i18n={i18n}>
            <Dashboard debounceMs={debounceMs} />
          </I18nextProvider>
        )
      })
      await component.findByText(t('timeInputs.title'))
    })

    const time = 2
    const newTimeInputJson: Hours = {
      project: projects[0].id,
      input: time * 60,
      description: '',
      date: format(monday, 'yyyy-MM-dd'),
      employee: '9fa407f4-7375-446b-92c6-c578839b7780',
    }

    it('the form should post correct json', async () => {
      await changeFirstTimeInput(component, time.toString())
      await component.findByText(t('timeInputs.savedMessage'), { exact: false })
      expect(axios.post).toBeCalledWith('undefined/hours', newTimeInputJson)
      expect(axios.put).toBeCalledTimes(0)
    })
  })
  describe('editing existing time input with correct field values', () => {
    beforeEach(async () => {
      mockedAxios.get.mockImplementation((url: string) => {
        if (url.includes('hours')) {
          if (url.includes(projects[0].id)) {
            return Promise.resolve({ data: timeInputs1 })
          }
          return Promise.resolve({ data: [] })
        }
        if (url.includes('projects')) {
          return Promise.resolve({ data: projects })
        }
        return Promise.reject(new Error('not found'))
      })
      mockedAxios.put.mockImplementationOnce((url: string) => {
        if (url.includes('hours')) {
          return Promise.resolve({ data: { id: '1' } })
        }
        return Promise.reject(new Error('not found'))
      })

      await act(async () => {
        component = render(
          <I18nextProvider i18n={i18n}>
            <Dashboard debounceMs={debounceMs} />
          </I18nextProvider>
        )
      })
      await component.findByText(t('timeInputs.title'))
    })

    const time = 2
    const updateTimeInputJson: HoursUpdate = {
      id: timeInputs1[0].id,
      input: time * 60,
      description: '',
    }

    it('the form should put correct json', async () => {
      await changeFirstTimeInput(component, time.toString())
      await component.findByText(t('timeInputs.savedMessage'), { exact: false })
      expect(axios.put).toBeCalledWith('undefined/hours', updateTimeInputJson)
      expect(axios.post).toBeCalledTimes(0)
    })
  })
})
