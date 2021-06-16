import axios from 'axios'
import { Client, ClientFormValues } from '../common/types'

const getAllClients = async (): Promise<Client[]> => {
  const { data } = await axios.get('/clients')
  return data as Client[]
}

const getClientsByEmployeeId = async (employeeId: string): Promise<Client[]> => {
  const { data } = await axios.get(`/employees/${employeeId}/clients`)
  return data as Client[]
}

const createClient = async (newClient: ClientFormValues): Promise<Client> => {
  const { data } = await axios.post('/clients', newClient)
  return data as Client
}

export { getAllClients, getClientsByEmployeeId, createClient }
