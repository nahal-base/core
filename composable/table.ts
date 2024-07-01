import { ref } from "vue"

export const useTable = () => {
    const azTableRef = ref<{ reload: Function }>()
    const reload = () => {
      if (azTableRef.value) {
        azTableRef.value.reload()
      }
    }
    return { azTableRef,reload }
}
