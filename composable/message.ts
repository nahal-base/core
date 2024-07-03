import { useI18n } from 'vue-i18n'
import {message} from 'ant-design-vue/es'
export const useMessage = () => {
    const { t } = useI18n()
    const add = () => message.success(t("successAdd"));
    const update = () => message.info(t("successUpdate"));
    const remove = () => message.error(t("successRemove"));
    return { add, update, remove }
}