import { isSameDay } from 'date-fns'
import { FormikErrors } from 'formik'
import axios from 'axios'
import {
  ProjectAndInputs,
  ProjectAndInputsWithId,
  TimeInput,
  Hours,
  HoursUpdate,
  InputWithId,
  HoursWithSavedIndex,
  Input,
} from '../common/types'
import { formatUnixDateFromDate, minutesToHoursAndMinutes } from '../services/dateAndTimeService'

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
  week: Date[],
  userId: string
): Promise<void> => {
  const hoursToPost: HoursWithSavedIndex<Hours>[] = []
  const hoursToPut: HoursUpdate[] = []
  for (let i = 0; i < projects.length; i += 1) {
    for (let j = 0; j < 7; j += 1) {
      const savedInput = savedProjects[i].inputs[j]
      const currentInput = projects[i].inputs[j]
      if (
        currentInput.time !== savedInput.time ||
        currentInput.description !== savedInput.description
      ) {
        if (savedInput.id === null) {
          hoursToPost.push({
            x: i,
            y: j,
            hour: {
              date: formatUnixDateFromDate(week[j]),
              input: timeStringToNumber(currentInput.time),
              description: currentInput.description,
              project: projects[i].id,
              employee: userId,
            },
          })
        } else {
          hoursToPut.push({
            id: savedInput.id as string,
            input: timeStringToNumber(currentInput.time),
            description: currentInput.description,
          })
        }
        savedInput.time = currentInput.time
        savedInput.description = currentInput.description
      }
    }
  }
  if (hoursToPost.length > 0) {
    const responses = await Promise.all(
      hoursToPost.map((hourWithSavedIndex) => axios.post('/hours', hourWithSavedIndex.hour))
    )
    const sPRef = savedProjects
    const data = responses.map((response) => response.data)
    hoursToPost.forEach((hourWithSavedIndex, i) => {
      sPRef[hourWithSavedIndex.x].inputs[hourWithSavedIndex.y].id = data[i].id as string
    })
  }
  if (hoursToPut.length > 0) {
    await Promise.all(hoursToPut.map((hour) => axios.put('/hours', hour)))
  }
}

const getProjectHours = async (
  projectId: string,
  start: Date,
  end: Date,
  userId: string
): Promise<TimeInput[]> => {
  const { data } = await axios.get(`/projects/${projectId}/hours`, {
    params: {
      userId,
      startDate: formatUnixDateFromDate(start),
      endDate: formatUnixDateFromDate(end),
    },
  })
  return data as TimeInput[]
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
      const timeInputInHoursAndMinutes = minutesToHoursAndMinutes(timeInput.input)
      inputs.push({
        time: timeInputInHoursAndMinutes,
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

const getErrorMessages = (errors: FormikErrors<{ projects: ProjectAndInputs[] }>): string[] => {
  const inputErrors = (errors.projects as FormikErrors<ProjectAndInputs>[]).reduce<
    FormikErrors<Input>[]
  >((filtered, project) => {
    if (project && project.inputs) {
      return filtered.concat(project.inputs as FormikErrors<Input>[])
    }
    return filtered
  }, [])
  return inputErrors.reduce<string[]>((filtered, input) => {
    if (input) {
      if (input.time) {
        filtered.push(input.time)
      }
      if (input.description) {
        filtered.push(input.description)
      }
    }
    return filtered
  }, [])
}

const sumTimeInputs = (timeInputs: string[]): number => {
  const totalTime = timeInputs
    .map((input) => {
      const number = timeStringToNumber(input)
      if (Number.isNaN(number)) {
        return 0
      }
      return number
    })
    .reduce((a, b) => a + b, 0)
  return totalTime
}

export {
  getProjectHours,
  updateHours,
  timeStringToNumber,
  timeInputsToWeekInputs,
  projectAndInputsWithIdToProjectAndInputs,
  getErrorMessages,
  minutesToHoursAndMinutes,
  sumTimeInputs,
}
