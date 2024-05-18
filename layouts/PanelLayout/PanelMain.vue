<template>
  <LayoutContent class="overflow-y-auto p-6">
    <Transition name="fade">
      <RouterView />
    </Transition>
  </LayoutContent>
</template>
<script lang="ts" setup>
import { RouterView } from 'vue-router'
import { LayoutContent } from 'ant-design-vue/es'
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
