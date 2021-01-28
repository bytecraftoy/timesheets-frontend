import axios from 'axios'
import { startOfWeek, addDays, format, isSameDay } from 'date-fns'
import {
  ProjectAndInputs,
  ProjectAndInputsWithId,
  TimeInput,
  Hours,
  HoursUpdate,
  InputWithId,
  HoursWithSavedIndex,
} from '../common/types'
import weekdays from '../common/constants'

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

const timeStringToNumber = (value: string): number => {
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
  projects: ProjectAndInputs[],
  savedProjects: ProjectAndInputsWithId[],
  week: Date[]
): Promise<void> => {
  const sPRef = savedProjects
  const hoursToPost: HoursWithSavedIndex<Hours>[] = []
  const hoursToPut: HoursUpdate[] = []
  for (let i = 0; i < projects.length; i += 1) {
    ;[0, 1, 2, 3, 4, 5, 6].forEach((j) => {
      if (
        projects[i].inputs[j].time !== savedProjects[i].inputs[j].time ||
        projects[i].inputs[j].description !== savedProjects[i].inputs[j].description
      ) {
        if (savedProjects[i].inputs[j].id === null) {
          hoursToPost.push({
            x: i,
            y: j,
            hour: {
              date: format(week[j], 'yyyy-MM-dd'),
              input: timeStringToNumber(projects[i].inputs[j].time),
              description: projects[i].inputs[j].description,
              project: projects[i].id,
              // TODO: decide how employee is passed to the server
              employee: '9fa407f4-7375-446b-92c6-c578839b7780',
            },
          })
        } else {
          hoursToPut.push({
            id: savedProjects[i].inputs[j].id as string,
            input: timeStringToNumber(projects[i].inputs[j].time),
            description: projects[i].inputs[j].description,
          })
          sPRef[i].inputs[j].time = projects[i].inputs[j].time
          sPRef[i].inputs[j].description = projects[i].inputs[j].description
        }
      }
    })
  }
  if (hoursToPost.length > 0) {
    const responses = await Promise.all(
      hoursToPost.map((hourWithSavedIndex) =>
        axios.post(`${baseUrl}/hours`, hourWithSavedIndex.hour)
      )
    )
    const data = responses.map((response) => response.data)
    hoursToPost.forEach((hourWithSavedIndex, i) => {
      sPRef[hourWithSavedIndex.x].inputs[hourWithSavedIndex.y].id = data[i].id as string
    })
  }
  if (hoursToPut.length > 0) {
    await Promise.all(hoursToPut.map((hour) => axios.put(`${baseUrl}/hours`, hour)))
  }
}

const getProjectHours = async (projectId: string, start: Date, end: Date): Promise<TimeInput[]> => {
  const { data } = await axios.get(`${baseUrl}/projects/${projectId}/hours`, {
    params: {
      userId: '9fa407f4-7375-446b-92c6-c578839b7780',
      startDate: format(start, 'yyyy-MM-dd'),
      endDate: format(end, 'yyyy-MM-dd'),
    },
  })
  return data as TimeInput[]
}

const getWeekDays = (dates: Date[]): string[] => {
  return dates.map((day) => `${weekdays[day.getDay()]} ${day.getDate()}.${day.getMonth() + 1}.`)
}

const getCurrentWeek = (): Date[] => {
  const week: Date[] = [startOfWeek(new Date(), { weekStartsOn: 1 })]
  for (let i = 1; i < 7; i += 1) {
    week.push(addDays(week[week.length - 1], 1))
  }
  return week
}

const findTimeInputWithDate = (timeInputs: TimeInput[], date: Date): TimeInput | null => {
  for (let i = 0; i < timeInputs.length; i += 1) {
    const [year, month, day] = timeInputs[i].date.split('-')
    const timeInputDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10))
    if (isSameDay(date, timeInputDate)) {
      return timeInputs[i]
    }
  }
  return null
}

const timeInputsToWeekInputs = (timeInputs: TimeInput[], week: Date[]): InputWithId[] => {
  const inputs: InputWithId[] = []

  for (let i = 0; i < week.length; i += 1) {
    const timeInput = findTimeInputWithDate(timeInputs, week[i])
    if (timeInput) {
      const minutes = timeInput.input
      const hours = minutes / 60
      const roundedHours = Math.floor(hours)
      const minutesLeft = (hours - roundedHours) * 60
      const roundedMinutes = Math.floor(minutesLeft)
      inputs.push({
        time: roundedMinutes === 0 ? `${roundedHours}h` : `${roundedHours}h ${roundedMinutes}m`,
        description: timeInput.description,
        id: timeInput.id,
      })
    } else {
      inputs.push({ time: '', description: '', id: null })
    }
  }

  return inputs
}

const projectAndInputsWithIdToProjectAndInputs = (
  projects: ProjectAndInputsWithId[]
): ProjectAndInputs[] =>
  projects.map((project) => {
    return {
      id: project.id,
      name: project.name,
      inputs: project.inputs.map((input) => {
        return { time: input.time, description: input.description }
      }),
    }
  })

export {
  getProjectHours,
  updateHours,
  getWeekDays,
  getCurrentWeek,
  timeStringToNumber,
  timeInputsToWeekInputs,
  projectAndInputsWithIdToProjectAndInputs,
}
