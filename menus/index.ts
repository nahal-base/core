import {computed, h} from "vue"
import data from '@/menus'
import {useI18n} from 'vue-i18n'
import {Icon} from '@iconify/vue'

const { t } = useI18n()

export const useMenus = ()=>{

    const items = computed(()=>{
        return data.map((item)=>{
            return    {
                key: item.key,
                label: t(item.label),
                icon: () => h(Icon, { icon: item.icon })
            },
        })
    })

    return {items}
}