<template>
  <Button
    class="flex items-center justify-center"
    :class="{ 'gap-x-2': props.icon }"
  >
    <template #icon v-if="props.icon">
      <Icon :icon="props.icon" />
    </template>
    <slot v-if="$slots.default" />
  </Button>
</template>

<script setup lang="ts">
import { Button } from "ant-design-vue/es";
interface Props {
  icon?: string;
}

const props = withDefaults(defineProps<Props>(), {
  icon: "",
});

import { Icon } from "@iconify/vue";
</script>
<style scoped lang="less"></style>
