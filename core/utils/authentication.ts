import { useLocalStorage } from '@vueuse/core'
import type { AuthDTO } from '@/core/types/authModel'
export const isAuthenticated = () => {
  const storage = useLocalStorage('User', {} as AuthDTO.User)
  const token = storage.value.accessToken
  if (!token) return false

  const tokenDate = token.split('.')[1]
  if (!tokenDate) return false

  const expiry = JSON.parse(atob(tokenDate)).exp
  if (!expiry) return false

  return Math.floor(new Date().getTime()) <= expiry * 1000
}
