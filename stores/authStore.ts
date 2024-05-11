// import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthService } from '@/core/services/authService'
import type { AuthDTO } from '@/core/types/authModel'
import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const authService = useAuthService()
  const userStorage = useLocalStorage('User', {} as AuthDTO.Login.Response)
  const login = async (data: AuthDTO.Login.Request) => {
    try {
      userStorage.value = await authService.login(data)
    } catch (error) {
      throw new Error('Error while fetching login')
    }
  }
  const logout = () => {
    userStorage.value = {} as AuthDTO.Login.Response
  }
  const currentUser = computed(() => userStorage.value)

  return { currentUser, login, logout }
})
