import axios from 'axios'
import { Manager } from '../common/types'

const baseUrl = process.env.REACT_APP_BACKEND_HOST

const getAllManagers = async (): Promise<Manager[]> => {
  const { data } = await axios.get(`${baseUrl}/managers`)
  return data as Manager[]
}

export default getAllManagers
