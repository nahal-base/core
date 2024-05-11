<template>
  <Card prefix-cls="am-card" ref="amCardRef" :loading="props.isLoading" bordered hoverable>
    <template #title v-if="props.title">
      <div :class="{ 'flex items-center gap-x-2 ': props.icon?.name }">
        <Icon v-if="props.icon?.name" :icon="props.icon?.name" :class="props.icon?.class" />
        {{ props.title }}
      </div>
      <Button @click="toggle" size="small" type="link" v-if="hasFullScreen">
        <template #icon> <Icon icon="lets-icons:full" /> </template>
      </Button>
    </template>
    <slot />
  </Card>
</template>
<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Card, Button } from 'ant-design-vue/es'
import { ref } from 'vue'
import { useFullscreen } from '@vueuse/core'
const amCardRef = ref<HTMLElement | null>(null)
const { toggle } = useFullscreen(amCardRef)
interface Props {
  title?: string
  hasFullScreen?: boolean
  isLoading?: boolean
  icon?: {
    name: string
    class?: string
  }
}
const props = withDefaults(defineProps<Props>(), {})
</script>
<style lang="less">
@namespace: 'am-card';
.am-card {
  .am-card-head-title {
    @apply flex justify-between pt-4;
  }
  &.am-card-hoverable {
    &:hover {
      @apply shadow-md;
    }
  }
}
</style>
