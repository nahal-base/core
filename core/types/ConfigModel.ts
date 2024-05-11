import faIR from 'ant-design-vue/es/locale/fa_IR'
import enUS from 'ant-design-vue/es/locale/en_US'

export type LocaleType = keyof typeof LocaleMapping
export const LocaleMapping = {
  en: enUS,
  fa: faIR
}
