import axios from 'axios'
import { startOfWeek, addDays, format } from 'date-fns'
import { Project, ProjectWithTimeInputs, weekInputs } from '../common/types'

const baseUrl = process.env.REACT_APP_BACKEND_HOST

interface Hours {
  input: string
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
          input: projects[i].inputs[key],
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

export { getProjects, updateHours, getWeekDays, getCurrentWeek }
