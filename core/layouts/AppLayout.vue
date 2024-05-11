<template>
  <ConfigProvider
    :theme="configStore.theme"
    :locale="configStore.locale"
    :component-size="configStore.size"
    :direction="configStore.direction"
  >
    <RouterView />
  </ConfigProvider>

</template>
<script lang="ts" setup>
import { ConfigProvider } from 'ant-design-vue/es'
import { RouterView } from 'vue-router'
import { useConfigStore } from '@/core/stores/configStore'

const configStore = useConfigStore()
</script>
