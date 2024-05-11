<template>
  <LayoutContent class="overflow-y-auto p-6">
    <RouterView />
  </LayoutContent>
</template>
<script lang="ts" setup>
import { RouterView } from 'vue-router'
import { LayoutContent } from 'ant-design-vue/es'
</script>