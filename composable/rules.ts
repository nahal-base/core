import { useI18n } from 'vue-i18n'
import { useRegex } from './regex'
export const useRules = () => {
  const { t } = useI18n()
  const regex = useRegex()
  const password = { required: true, message: t('rules.password'), pattern: regex.password }
  const ltr = { required: true, message: t('rules.ltr'), pattern: regex.ltr }
  const email = { required: true, message: t('rules.email'), pattern: regex.email }
  const required = { required: true, message: t('rules.required') }
  return { required, email, password, ltr }
}
