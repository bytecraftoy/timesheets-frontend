import axios from 'axios'
import { ProjectFormValues } from '../common/types'

const baseUrl = process.env.REACT_APP_BACKEND_HOST

async function getAll<T>(path: string): Promise<T> {
  const { data } = await axios.get(`${baseUrl}/${path}`)
  return data
}

async function create<T>(newObject: ProjectFormValues): Promise<T> {
  const { data } = await axios.post(`${baseUrl}/projects`, newObject)
  return data
}

export { getAll, create }
