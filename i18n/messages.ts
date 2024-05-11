import faCore from './fa'
import enCore from './en'
import fa from '@/messages/fa'
import en from '@/messages/en'

export default {
  fa: { ...faCore, ...fa },
  en: { ...enCore, ...en }
}
