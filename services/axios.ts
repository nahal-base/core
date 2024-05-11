import { useLocalStorage } from '@vueuse/core'
import { message } from 'ant-design-vue'
import axios, { AxiosError, type AxiosInstance } from 'axios'
import { join } from 'lodash'
import { computed, type Ref } from 'vue'
import type { AuthDTO } from '../types/authModel'

interface ConfigModel {
  url: string
  query?: string
  data?: any
}

class AxiosService {
  private baseUrl: string
  private controller: AbortController
  private instance: AxiosInstance
  private auth: Ref<string>

  constructor() {
    this.baseUrl = import.meta.env.VITE_APP_API_URL;
    this.controller = new AbortController()
    this.instance = axios.create({
      baseURL: this.baseUrl,
      withCredentials: false,
      headers: {
        Accept: 'application/json',
        'content-type': 'application/json'
      },
      timeout: 5000
    })
    this.auth = computed(() => {
      const storage = useLocalStorage('User', {} as AuthDTO.User)
      return storage.value.tokenType + ' ' + storage.value.accessToken
    })
    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config) => {
        if (config.headers && this.auth.value) {
          config.headers.Authorization = this.auth.value
        }
        config.signal = this.controller.signal
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const data: any = (error as AxiosError).response?.data
        message.error(data?.message || 'An error occurred')
        return Promise.reject(data)
      }
    )
  }

  public async post(config: ConfigModel) {
    const res = await this.instance.post(config.url + (config.query || ''), config.data)
    return res.data
  }

  public async get({ url, query, data }: { url: string; query?: string; data?: object }) {
    const res = await this.instance.get(url + (query ? join(query, '') : ''), { params: data })
    return res.data
  }

  public async put({ url, query, data }: { url: string; query?: string; data?: object }) {
    const res = await this.instance.put(url + (query || ''), data)
    return res.data
  }

  public async delete({ url, query, data }: { url: string; query?: string; data?: object }) {
    const res = await this.instance.delete(url + (query || ''), { data })
    return res.data
  }

  cancel() {
    this.controller.abort()
  }
}

const axiosService = new AxiosService()

export default function useAxios() {
  return axiosService
}
