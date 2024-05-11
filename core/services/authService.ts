import type { AuthDTO } from '@/core/types/authModel'
import useAxios from './axios'

const axios = useAxios()
export const useAuthService = () => {
  const login = async (data: AuthDTO.Login.Request): Promise<AuthDTO.Login.Response> => {
    return await axios.post({
      url: '/auth/signin',
      data: data,
      query: ''
    })
  }

  return { login }
}
