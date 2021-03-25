import axios from 'axios'
import { Project, ProjectFormValues, ProjectUpdateValues } from '../common/types'

const getAllProjects = async (): Promise<Project[]> => {
  const { data } = await axios.get('/projects')
  return data as Project[]
}

const getProjectsByClientId = async (clientId: string): Promise<Project[]> => {
  const { data } = await axios.get(`/clients/${clientId}/projects`)
  return data as Project[]
}

const getProjectsByEmployeeId = async (employeeId: string): Promise<Project[]> => {
  const { data } = await axios.get(`/employees/${employeeId}/projects`)
  return data as Project[]
}

const createProject = async (newProject: ProjectFormValues): Promise<Project> => {
  const { data } = await axios.post('/projects', newProject)
  return data as Project
}

const updateProject = async (project: ProjectUpdateValues): Promise<Project> => {
  const { data } = await axios.put('/projects', project)
  return data as Project
}

export {
  getAllProjects,
  getProjectsByClientId,
  getProjectsByEmployeeId,
  createProject,
  updateProject,
}
