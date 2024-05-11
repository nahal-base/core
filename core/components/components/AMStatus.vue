<template>
  <div class="flex items-center gap-x-2" v-if="props.status">
    <div class="bg-green w-2 h-2 rounded-full"></div>
    <div class="text-xs">{{ t('active') }}</div>
  </div>
  <div class="flex items-center gap-x-2" v-else>
    <div class="bg-red w-2 h-2 rounded-full"></div>
    <div class="text-xs">{{ t('deactivate') }}</div>
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface Props {
  status: boolean
}
const props = withDefaults(defineProps<Props>(), {
  status: false
})

const { t } = useI18n()
</script>
