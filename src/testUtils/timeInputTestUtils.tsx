import { format } from 'date-fns'
import { TimeInput } from '../common/types'

const week: Date[] = [
  new Date(2021, 0, 4),
  new Date(2021, 0, 5),
  new Date(2021, 0, 6),
  new Date(2021, 0, 7),
  new Date(2021, 0, 8),
  new Date(2021, 0, 9),
  new Date(2021, 0, 10),
]

const timeInputs: TimeInput[] = [
  {
    id: '1',
    input: 150,
    date: format(week[0], 'yyyy-MM-dd'),
    creationTimestamp: 100000000000,
    lastEdited: 100000000000,
  },
  {
    id: '2',
    input: 450,
    date: format(week[1], 'yyyy-MM-dd'),
    creationTimestamp: 100000000000,
    lastEdited: 100000000000,
  },
  {
    id: '3',
    input: 300,
    date: format(week[3], 'yyyy-MM-dd'),
    creationTimestamp: 100000000000,
    lastEdited: 100000000000,
  },
]

export { week, timeInputs }
