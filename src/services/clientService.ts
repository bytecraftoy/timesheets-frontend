import axios from './axiosConfig'
import { Client } from '../common/types'

const getAllClients = async (userId: string): Promise<Client[]> => {
  const { data } = await axios(userId).get('/clients')
  return data as Client[]
}

const getClientsByEmployeeId = async (employeeId: string, userId: string): Promise<Client[]> => {
  const { data } = await axios(userId).get(`/employees/${employeeId}/clients`)
  return data as Client[]
}

export { getAllClients, getClientsByEmployeeId }
