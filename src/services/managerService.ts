import axios from './axiosConfig'
import { Manager } from '../common/types'

const getAllManagers = async (userId: string): Promise<Manager[]> => {
  const { data } = await axios(userId).get('/managers')
  return data as Manager[]
}

export default getAllManagers
