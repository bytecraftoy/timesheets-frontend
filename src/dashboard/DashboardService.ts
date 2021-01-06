import axios from 'axios'
import { startOfWeek, addDays, format, isEqual } from 'date-fns'
import { Project, ProjectWithTimeInputs, WeekInputs, TimeInput, Hours } from '../common/types'

const baseUrl = process.env.REACT_APP_BACKEND_HOST

const hoursToMinutes = (hours: string) => Math.round(Number(hours) * 60)

const hourAndMinuteInputToMinutes = (hoursString: string, minuteString: string) => {
  const minutes = Number(minuteString)
  if (minutes > 59) {
    return Number.NaN
  }
  return Number(hoursString) * 60 + minutes
}

const formats = [
  /^\s*\d+,\d+\s*$/,
  /^\s*\d+(\.\d+)?\s*h\s*$/i,
  /^\s*\d+,\d+\s*h\s*$/i,
  /^\s*\d+\s*m\s*$/i,
  /^\s*\d+\s*min\s*$/i,
  /^\s*\d+\s*h\s*\d+\s*$/i,
  /^\s*\d+\s*h\s*\d+\s*m\s*$/i,
  /^\s*\d+\s*h\s*\d+\s*min\s*$/i,
  /^\s*\d+:\d+\s*$/,
]

const formatTranslations = [
  (x: string) => hoursToMinutes(x.replace(',', '.')),
  (x: string) => hoursToMinutes(x.replace(/h/i, '')),
  (x: string) => hoursToMinutes(x.replace(/h/i, '').replace(',', '.')),
  (x: string) => Number(x.replace(/m/i, '')),
  (x: string) => Number(x.replace(/min/i, '')),
  (x: string) => {
    const split = x.split(/h/i)
    return hourAndMinuteInputToMinutes(split[0], split[1])
  },
  (x: string) => {
    const split = x.split(/h/i)
    return hourAndMinuteInputToMinutes(split[0], split[1].replace(/m/i, ''))
  },
  (x: string) => {
    const split = x.split(/h/i)
    return hourAndMinuteInputToMinutes(split[0], split[1].replace(/min/i, ''))
  },
  (x: string) => {
    const split = x.split(':')
    return hourAndMinuteInputToMinutes(split[0], split[1])
  },
]

const inputStringToNumber = (value: string): number => {
  if (!Number.isNaN(Number(value))) {
    return hoursToMinutes(value)
  }

  for (let i = 0; i < formats.length; i += 1) {
    if (formats[i].test(value)) {
      return formatTranslations[i](value)
    }
  }
  return Number.NaN
}

const updateHours = async (
  projects: ProjectWithTimeInputs[],
  savedProjects: ProjectWithTimeInputs[],
  week: Date[]
): Promise<void> => {
  const hoursToSend: Hours[] = []
  const keys = Object.keys(projects[0].inputs) as Array<keyof WeekInputs>
  for (let i = 0; i < projects.length; i += 1) {
    keys.forEach((key, j) => {
      if (projects[i].inputs[key] !== savedProjects[i].inputs[key]) {
        hoursToSend.push({
          date: format(week[j], 'yyyy-MM-dd'),
          input: inputStringToNumber(projects[i].inputs[key]),
          project: projects[i].id,
          // TODO: decide how employee is passed to the server
          employee: 'a3f4e844-4199-439d-a463-2f07e87c6ca4',
        })
      }
    })
  }
  if (hoursToSend.length > 0) {
    await Promise.all(hoursToSend.map((hour) => axios.post(`${baseUrl}/hours`, hour)))
  }
}

const getProjectHours = async (projectId: string, start: Date, end: Date): Promise<TimeInput[]> => {
  const { data } = await axios.get(`${baseUrl}/projects/${projectId}/hours`, {
    params: {
      userId: 'a3f4e844-4199-439d-a463-2f07e87c6ca4',
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(end, 'yyyy-MM-dd'),
    },
  })
  return data as TimeInput[]
}

const getProjects = async (): Promise<Project[]> => {
  const { data } = await axios.get(`${baseUrl}/projects`)
  return data as Project[]
}

const getWeekDays = (dates: Date[]): string[] => {
  const weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return dates.map((day) => `${weekdays[day.getDay()]} ${day.getDate()}.${day.getMonth() + 1}.`)
}

const getCurrentWeek = (): Date[] => {
  const week: Date[] = [startOfWeek(new Date(), { weekStartsOn: 1 })]
  for (let i = 1; i < 7; i += 1) {
    week.push(addDays(week[week.length - 1], 1))
  }
  return week
}

const inputsToWeekInputsObject = (timeinputs: TimeInput[], week: Date[]): WeekInputs => {
  const defaultEmptyTimeInput: string[] = Array(7).fill('')
  const timeInputs = defaultEmptyTimeInput
  const timeInputValues = Object.values(timeinputs)

  for (let i = 0; i < week.length; i += 1) {
    for (let j = 0; j < timeInputValues.length; j += 1) {
      if (!timeInputValues[j].date) break
      const [year, month, day] = timeInputValues[j].date.split('-')
      const inputDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10))

      if (isEqual(week[i], inputDate)) {
        const minutes = timeInputValues[j].input
        const hours = minutes / 60
        const roundedHours = Math.floor(hours)
        const minutesLeft = (hours - roundedHours) * 60
        const roundedMinutes = Math.floor(minutesLeft)
        timeInputs[i] =
          roundedMinutes === 0 ? `${roundedHours}h` : `${roundedHours}h ${roundedMinutes}m`
      }
    }
  }

  const inputs: WeekInputs = {
    mondayInput: timeInputs[0],
    tuesdayInput: timeInputs[1],
    wednesdayInput: timeInputs[2],
    thursdayInput: timeInputs[3],
    fridayInput: timeInputs[4],
    saturdayInput: timeInputs[5],
    sundayInput: timeInputs[6],
  }

  return inputs
}

export {
  getProjects,
  getProjectHours,
  updateHours,
  getWeekDays,
  getCurrentWeek,
  inputStringToNumber,
  inputsToWeekInputsObject,
}
