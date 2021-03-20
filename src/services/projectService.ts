import axios from './axiosConfig'
import { Project, ProjectFormValues } from '../common/types'

const getAllProjects = async (userId: string): Promise<Project[]> => {
  const { data } = await axios(userId).get('/projects')
  return data as Project[]
}

const getProjectsByEmployeeId = async (employeeId: string, userId: string): Promise<Project[]> => {
  const { data } = await axios(userId).get(`/employees/${employeeId}/projects`)
  return data as Project[]
}

const getProjectsByClientId = async (clientId: string, userId: string): Promise<Project[]> => {
  const { data } = await axios(userId).get(`/clients/${clientId}/projects`)
  return data as Project[]
}

const createProject = async (newProject: ProjectFormValues, userId: string): Promise<Project> => {
  const { data } = await axios(userId).post(`/projects`, newProject)
  return data as Project
}

export { getAllProjects, getProjectsByClientId, createProject, getProjectsByEmployeeId }
