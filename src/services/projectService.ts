import axios from 'axios'
import qs from 'qs'
import { Employee, Project, ProjectFormValues } from '../common/types'

const baseUrl = process.env.REACT_APP_BACKEND_HOST

const getAllProjects = async (): Promise<Project[]> => {
  const { data } = await axios.get(`${baseUrl}/projects`)
  return data as Project[]
}

const createProject = async (newProject: ProjectFormValues): Promise<Project> => {
  const { data } = await axios.post(`${baseUrl}/projects`, newProject)
  return data as Project
}

const getEmployeesByProjectIds = async (projectIds: string[]): Promise<Employee[]> => {
  const { data } = await axios.get(`${baseUrl}/projects/employees`, {
    params: {
      projects: projectIds,
    },
    paramsSerializer: (params) => {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    },
  })
  return data as Employee[]
}

export { getAllProjects, createProject, getEmployeesByProjectIds }
