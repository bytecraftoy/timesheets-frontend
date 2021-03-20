import axios from './axiosConfig'
import { Client } from '../common/types'

const getAllClients = async (): Promise<Client[]> => {
  const { data } = await axios.get('/clients')
  return data as Client[]
}

const getClientsByEmployeeId = async (employeeId: string): Promise<Client[]> => {
  const { data } = await axios.get(`/employees/${employeeId}/clients`)
  return data as Client[]
}

export { getAllClients, getClientsByEmployeeId }
