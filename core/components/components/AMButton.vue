

<template>
<Button class="flex  items-center" :class="$slots.default ? 'justify-between':'justify-center'">
<template #icon>
  <Icon :icon="props.icon" />
</template>
  <template v-if="$slots.default"><slot /></template>
</Button>
</template>

<script setup lang="ts">
import {Button} from "ant-design-vue/es"
interface Props{
  icon: string
}

const props = withDefaults(defineProps<Props>(),{
  icon: ''
})

import { Icon } from '@iconify/vue'
</script>
<style scoped lang="less">

</style>