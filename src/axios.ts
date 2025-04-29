import axios from 'axios'

console.log(import.meta.env.VITE_API_URL)
const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export default apiInstance
