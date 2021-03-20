import axios, { AxiosInstance } from 'axios'

const axiosConfig = (userId: string): AxiosInstance => {
  const config = {
    baseURL: process.env.REACT_APP_BACKEND_HOST,
    timeout: 10000,
    Headers: {
      'X-User-Id': '',
    },
  }

  const instance = axios.create(config)

  instance.defaults.headers.get.Accept = 'application/json'
  instance.defaults.headers.post.Accept = 'application/json'

  instance.interceptors.request.use(
    (req) => {
      req.headers['X-User-Id'] = userId
      return req
    },
    (error) => Promise.reject(error)
  )

  return instance
}

export default axiosConfig
