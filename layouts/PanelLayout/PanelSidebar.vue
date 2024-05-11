<template>
  <LayoutSider collapsible class="" v-model:collapsed="collapsed">
    <div class="logo h-14 bg-blue-500 flex justify-center items-center gap-x-2">
      <img class="h-10 w-10 object-contain" src="/logo-2.png" alt="" srcset="" />
      <span v-if="!collapsed" class="text-white">سامانه نهال</span>
    </div>

    <Menu
      class="h-full"
      v-model:selectedKeys="selectedKeys"
      mode="inline"
      :items="items"
      @click="handleClick"
      @openChange="router.push({ name: selectedKeys[0] })"
    />
  </LayoutSider>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { MenuProps } from 'ant-design-vue'
import { Menu, LayoutSider } from 'ant-design-vue/es'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { h } from 'vue'
import { Icon } from '@iconify/vue'



const collapsed = ref<boolean>(false)

const selectedKeys = ref<string[]>(['TheDashboard'])

const route = useRoute()
const { t } = useI18n()
onMounted(() => {
  selectedKeys.value = [String(route.name)]
})

const router = useRouter()

const handleClick: MenuProps['onClick'] = (e) => {
  router.push({ name: `${e.key}` })
}

const items = ref([
  {
    key: 'TheDashboard',
    label: t('dashboard'),
    icon: () => h(Icon, { icon: 'tabler:layout-dashboard' })
  },
  {
    key: 'ThePlans',
    label: t('plans'),
    icon: () => h(Icon, { icon: 'tabler:database' })
  },

  {
    key: 'TheApiList',
    label: t('apiItems'),
    icon: () => h(Icon, { icon: 'fluent:folder-list-16-regular' })
  },
  {
    key: 'TheReports',
    label: t('reports'),
    icon: () => h(Icon, { icon: 'iconoir:reports' }),
    children: [
      {
        key: 'TheHistoryUsage',
        label: t('historyUsage')
      },
      {
        key: 'TheDataUsage',
        label: t('dataUsage')
      }
    ]
  }
])
</script>
<style lang="less">
.ant-layout-sider-trigger {
  @apply !bg-primary;
}
</style>
