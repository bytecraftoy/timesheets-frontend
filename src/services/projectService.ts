import axios from 'axios'
import { Project, ProjectFormValues, ProjectUpdateValues } from '../common/types'

const baseUrl = process.env.REACT_APP_BACKEND_HOST

const getAllProjects = async (): Promise<Project[]> => {
  const { data } = await axios.get(`${baseUrl}/projects`)
  return data as Project[]
}

const getProjectsByClientId = async (clientId: string): Promise<Project[]> => {
  const { data } = await axios.get(`${baseUrl}/clients/${clientId}/projects`)
  return data as Project[]
}

const createProject = async (newProject: ProjectFormValues): Promise<Project> => {
  const { data } = await axios.post(`${baseUrl}/projects`, newProject)
  return data as Project
}

const updateProject = async (project: ProjectUpdateValues): Promise<Project> => {
  const { data } = await axios.put(`${baseUrl}/projects`, project)
  return data as Project
}

export { getAllProjects, getProjectsByClientId, createProject, updateProject }
