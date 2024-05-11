import { createI18n } from 'vue-i18n'
import messages from './messages'
import { LanguagesEnum } from '@/core/enums'

const config = JSON.parse(localStorage.getItem('config') || '{}').locale ?? LanguagesEnum.FARSI

export default createI18n({
  legacy: false,
  globalInjection: true,
  locale: config,
  fallbackLocale: ['en', 'fa'],
  messages
})
