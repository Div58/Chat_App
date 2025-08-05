import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})
console.log('Axios Base URL:', axiosInstance.defaults.baseURL)
console.log('import.meta.env.VITE_API_URL:', import.meta.env.VITE_API_URL)

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axiosInstance
