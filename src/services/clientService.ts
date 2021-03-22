import axios from 'axios'
import { Client } from '../common/types'

const baseUrl = process.env.REACT_APP_BACKEND_HOST

const getAllClients = async (): Promise<Client[]> => {
  const { data } = await axios.get(`${baseUrl}/clients`)
  return data as Client[]
}

const getClientsByEmployeeId = async (employeeId: string): Promise<Client[]> => {
  const { data } = await axios.get(`${baseUrl}/employees/${employeeId}/clients`)
  return data as Client[]
}

export { getAllClients, getClientsByEmployeeId }
