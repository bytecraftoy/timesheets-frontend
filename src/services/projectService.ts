import axios from 'axios'
import { Project, ProjectFormValues } from '../common/types'

const baseUrl = process.env.REACT_APP_BACKEND_HOST

const getAllProjects = async (): Promise<Project[]> => {
  const { data } = await axios.get(`${baseUrl}/projects`)
  return data as Project[]
}

const createProject = async (newProject: ProjectFormValues): Promise<Project> => {
  const { data } = await axios.post(`${baseUrl}/projects`, newProject)
  return data as Project
}

export { getAllProjects, createProject }
