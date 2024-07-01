import { ref } from "vue";
import { isFunction } from "lodash";

export const useModal = () => {
  const isOpen = ref<boolean>(false);

  const open = (...callbacks: Function[]) => {
    callbacks.forEach((callback) => {
      if (isFunction(callback)) {
        callback();
      }
    });
    isOpen.value = true;
  };

  const close = () => {
    isOpen.value = false;
  };

  const toggle = () => {
    isOpen.value = !isOpen.value;
  };

  const invokeToggle = (...callbacks: (Function | Promise<void> | void)[]) => {
    callbacks.forEach((callback) => {
      if (isFunction(callback)) {
        callback();
      }
    });
    isOpen.value = !isOpen.value;
  };

  const invokeAsyncToggle = async (
    ...callbacks: (Function | Promise<void>)[]
  ) => {
    for (const callback of callbacks) {
      if (isFunction(callback)) {
        await callback();
      } else if (callback instanceof Promise) {
        await callback;
      }
    }
    isOpen.value = !isOpen.value;
  };

  const toggleInvoke = (...callbacks: (Function | Promise<void>)[]) => {
    isOpen.value = !isOpen.value;
    callbacks.forEach((callback) => {
      if (isFunction(callback)) {
        callback();
      } else if (callback instanceof Promise) {
        callback;
      }
    });
  };

  const toggleInvokeAsync = async (
    ...callbacks: (Function | Promise<void>)[]
  ) => {
    isOpen.value = !isOpen.value;
    for (const callback of callbacks) {
      if (isFunction(callback)) {
        await callback();
      } else if (callback instanceof Promise) {
        await callback;
      }
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
