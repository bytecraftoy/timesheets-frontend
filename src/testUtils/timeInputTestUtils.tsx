import { format } from 'date-fns'
import { TimeInput } from '../common/types'
import { getCurrentWeek } from '../services/dateAndTimeService'

const week: Date[] = getCurrentWeek()

const timeInputs: TimeInput[] = [
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
    description: '',
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
]

export { week, timeInputs }
