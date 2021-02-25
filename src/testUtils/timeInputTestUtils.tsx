import { act, fireEvent, RenderResult } from '@testing-library/react'
import { format } from 'date-fns'
import { TimeInput } from '../common/types'
import { getCurrentWeek } from '../services/dateAndTimeService'
import { t } from './testUtils'

const week: Date[] = getCurrentWeek()

const timeInputs1: TimeInput[] = [
  {
    id: '1',
    input: 150,
    description: '',
    date: format(week[0], 'yyyy-MM-dd'),
    creationTimestamp: 100000000000,
    lastEdited: 100000000000,
  },
  {
    id: '2',
    input: 450,
    description: 'aaaaaaaaaaaaaaa',
    date: format(week[1], 'yyyy-MM-dd'),
    creationTimestamp: 100000000000,
    lastEdited: 100000000000,
  },
  {
    id: '3',
    input: 300,
    description: '',
    date: format(week[3], 'yyyy-MM-dd'),
    creationTimestamp: 100000000000,
    lastEdited: 100000000000,
  },
  {
    id: '4',
    input: 123,
    description: 'bbbbbbbbbbb',
    date: format(week[6], 'yyyy-MM-dd'),
    creationTimestamp: 100000000000,
    lastEdited: 100000000000,
  },
]

const timeInputs2: TimeInput[] = [
  {
    id: '5',
    input: 170,
    description: 'oargodbjnbarbno',
    date: format(week[0], 'yyyy-MM-dd'),
    creationTimestamp: 100000000000,
    lastEdited: 100000000000,
  },
  {
    id: '6',
    input: 1000,
    description: 'bbbbbbbbbbbbbbbbb',
    date: format(week[1], 'yyyy-MM-dd'),
    creationTimestamp: 100000000000,
    lastEdited: 100000000000,
  },
  {
    id: '7',
    input: 1200,
    description: 'Hello world',
    date: format(week[3], 'yyyy-MM-dd'),
    creationTimestamp: 100000000000,
    lastEdited: 100000000000,
  },
]

const clickShowDescriptionSwitch = async (component: RenderResult): Promise<void> => {
  await act(async () => {
    fireEvent.click(component.getByLabelText(t('project.description.label')))
  })
}

const changeFirstTimeInput = async (component: RenderResult, value: string): Promise<void> => {
  const timeInput = component.getByTestId('projects[0].inputs[0].time')
  await act(async () => {
    fireEvent.change(timeInput, { target: { value } })
    await component.findByDisplayValue(value)
  })
}

const changeFirstDescriptionInput = async (
  component: RenderResult,
  value: string
): Promise<void> => {
  const descriptionInput = component.getByTestId('projects[0].inputs[0].description')
  await act(async () => {
    fireEvent.change(descriptionInput, { target: { value } })
    await component.findByDisplayValue(value)
  })
}

export {
  week,
  timeInputs1,
  timeInputs2,
  clickShowDescriptionSwitch,
  changeFirstTimeInput,
  changeFirstDescriptionInput,
}
