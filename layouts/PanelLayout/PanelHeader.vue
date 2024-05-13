<template>
  <LayoutHeader
    class="!bg-gradient-to-r !h-14 flex items-center !pr-0 !pl-4"
    :class="
      configStore.configStorage.locale === 'fa'
        ? '!from-blue !to-blue-500'
        : '!from-blue-500 !to-blue'
    "
  >
    <div class="flex items-center ms-auto">
      <Dropdown :trigger="['click']" class="!ms-auto">
        <AMButton
          icon="tabler:user"
          type="text"
          class="text-white !flex !items-center gap-x-2"
          @click.prevent
        >
          {{ authStore.currentUser.username }}
        </AMButton>
        <template #overlay>
          <Menu>
            <!--            <Divider class="!my-0" />-->
            <MenuItem key="0" class="!text-red" @click="logout">
              {{ t('panel.exit') }}
              <template #icon>
                <Icon icon="uil:signout" />
              </template>
            </MenuItem>
          </Menu>
        </template>
      </Dropdown>
      <AppSetting />
      <!-- <LockScreen /> -->
    </div>
  </LayoutHeader>
</template>
<script lang="ts" setup>
import { Dropdown, LayoutHeader, Menu, MenuItem } from 'ant-design-vue/es'
import { Icon } from '@iconify/vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/core/stores/authStore'
import { useConfigStore } from '@/core/stores/configStore'
// import LockScreen from '@/core/components/LockScreen.vue'
import AppSetting from '@/core/components/AppSetting.vue'
import { AMButton } from '@/core/components/components'
import { useI18n } from 'vue-i18n'

const configStore = useConfigStore()
const authStore = useAuthStore()
const router = useRouter()

const { t } = useI18n()
const logout = () => {
  authStore.logout()
  router.push({ name: 'TheAuthLogin' })
}
</script>
