import axios from 'axios'
import { startOfWeek, addDays, format } from 'date-fns'
import { Project, ProjectWithTimeInputs, weekInputs } from '../common/types'

const baseUrl = process.env.REACT_APP_BACKEND_HOST

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
  (x: string) => Number(x.replace(',', '.')),
  (x: string) => Number(x.replace(/h/i, '')),
  (x: string) => Number(x.replace(/h/i, '').replace(',', '.')),
  (x: string) => Number(x.replace(/m/i, '')) / 60,
  (x: string) => Number(x.replace(/min/i, '')) / 60,
  (x: string) => {
    const split = x.split(/h/i)
    const hours = Number(split[0])
    const minutes = Number(split[1])
    if (minutes > 59) {
      return Number.NaN
    }
    return hours + minutes / 60
  },
  (x: string) => {
    const split = x.split(/h/i)
    const hours = Number(split[0])
    const minutes = Number(split[1].replace(/m/i, ''))
    if (minutes > 59) {
      return Number.NaN
    }
    return hours + minutes / 60
  },
  (x: string) => {
    const split = x.split(/h/i)
    const hours = Number(split[0])
    const minutes = Number(split[1].replace(/min/i, ''))
    if (minutes > 59) {
      return Number.NaN
    }
    return hours + minutes / 60
  },
  (x: string) => {
    const split = x.split(':')
    const hours = Number(split[0])
    const minutes = Number(split[1])
    if (minutes > 59) {
      return Number.NaN
    }
    return hours + minutes / 60
  },
]

const InputStringToNumber = (value: string): number => {
  const n = Number(value)
  if (!Number.isNaN(n)) {
    return n
  }

  for (let i = 0; i < formats.length; i += 1) {
    if (formats[i].test(value)) {
      return formatTranslations[i](value)
    }
  }
  return Number.NaN
}

interface Hours {
  input: number
  date: string
  project: number
  employee: number
}

const updateHours = async (
  projects: ProjectWithTimeInputs[],
  savedProjects: ProjectWithTimeInputs[],
  week: Date[]
): Promise<void> => {
  const hoursToSend: Hours[] = []
  const keys = Object.keys(projects[0].inputs) as Array<keyof weekInputs>
  for (let i = 0; i < projects.length; i += 1) {
    keys.forEach((key, j) => {
      if (projects[i].inputs[key] !== savedProjects[i].inputs[key]) {
        hoursToSend.push({
          date: format(week[j], 'yyyy-MM-dd'),
          input: InputStringToNumber(projects[i].inputs[key]),
          project: projects[i].id,
          // TODO: decide how employee is passed to the server
          employee: 3,
        })
      }
    })
  }
  if (hoursToSend.length > 0) {
    await Promise.all(hoursToSend.map((hour) => axios.post(`${baseUrl}/hours`, hour)))
  }
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

export { getProjects, updateHours, getWeekDays, getCurrentWeek, InputStringToNumber }
