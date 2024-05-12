import { computed, ref } from 'vue'
import { message } from 'ant-design-vue/es'
import { useI18n } from 'vue-i18n'
import { isFunction } from 'lodash'

export const useModal = () => {
  const isOpenRef = ref<boolean>(false)

  const isOpen = computed(() => isOpenRef.value)

  const open = (callBack: Function) => {
    if (isFunction(callBack)) {
      callBack()
    }
    isOpenRef.value = true
  }
  const close = () => {
    isOpenRef.value = false
  }

  return { isOpen, open, close }
}

