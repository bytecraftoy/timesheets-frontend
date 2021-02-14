import axios from 'axios'
import { Client, Project } from '../common/types'

const baseUrl = process.env.REACT_APP_BACKEND_HOST

const getAllClients = async (): Promise<Client[]> => {
  const { data } = await axios.get(`${baseUrl}/clients`)
  return data as Client[]
}

const getProjectsByClientId = async (clientId: string): Promise<Project[]> => {
  const { data } = await axios.get(`${baseUrl}/clients/${clientId}/projects`)
  return data as Project[]
}

const getClientsByEmployeeId = async (employeeId: string): Promise<Client[]> => {
  const { data } = await axios.get(`${baseUrl}/employees/${employeeId}/clients`)
  return data as Client[]
}

export { getAllClients, getProjectsByClientId, getClientsByEmployeeId }
