import { computed, ref } from "vue";
import { message } from "ant-design-vue/es";
import { useI18n } from "vue-i18n";
import { isFunction } from "lodash";

export const useModal = () => {
  const isOpen = ref<boolean>(false);

  // const isOpen = computed(() => isOpenRef.value);

  const open = (callBack: Function) => {
    if (isFunction(callBack)) {
      callBack();
    }
    isOpen.value = true;
  };
  const close = () => {
    isOpen.value = false;
  };

  const toggle = () => {
    isOpen.value = !isOpen.value;
  };
  const invokeToggle = (callback: Function) => {
    if (isFunction(callback)) {
      callback();
    }
    isOpen.value = !isOpen.value;
  };
  const invokeAsyncToggle = async (callback: Function) => {
    if (isFunction(callback)) {
      await callback();
    }
    isOpen.value = !isOpen.value;
  };
  const toggleInvoke = (callback: Function) => {
    isOpen.value = !isOpen.value;
    if (isFunction(callback)) {
      callback();
    }
  };
  const toggleInvokeAsync = async (callback: Function) => {
    isOpen.value = !isOpen.value;
    if (isFunction(callback)) {
      await callback();
    }
  };

  return {
    isOpen,
    open,
    close,
    toggle,
    invokeToggle,
    toggleInvoke,
    invokeAsyncToggle,
    toggleInvokeAsync,
  };
};
