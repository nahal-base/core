import { useI18n } from 'vue-i18n'
import {message} from 'ant-design-vue/es'
export const useMessage = () => {
    const { t } = useI18n()
    const add = () => message.success(t('successAdd'))
    const update = () => message.success(t('successUpdate'))
    const remove = () => message.success(t('successRemove'))
    return { add, update, remove }
}