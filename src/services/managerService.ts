import axios from 'axios'
import { Manager } from '../common/types'

const getAllManagers = async (): Promise<Manager[]> => {
  const { data } = await axios.get('/managers')
  return data as Manager[]
}

export default getAllManagers
