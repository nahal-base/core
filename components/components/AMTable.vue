<template>
  <Table>
    <template #title>
      <div class="flex justify-between mb-4">
        <div class="text-xl font-medium flex-1">{{ props.label }}</div>
        <Select v-model:value="paginate.pageSize" @change="changePaginate" size="small">
          <SelectOption :value="5">5</SelectOption>
          <SelectOption :value="10">10</SelectOption>
          <SelectOption :value="20">20</SelectOption>
          <SelectOption :value="50">50</SelectOption>
          <SelectOption :value="100">100</SelectOption>
        </Select>
        <AMButton type="link" @click="emits('addRow')" class="flex items-center" icon="tabler:plus">
          {{ t('add') }}
        </AMButton>
      </div>
    </template>
    <template #bodyCell="{ column, record }">
      <slot name="amir" :column="column" :record="record" />
      <template v-if="column.key === 'action'">
        <Dropdown>
          <AMButton
            type="text"
            @click.prevent
            class="ant-dropdown-link"
            icon="icon-park-outline:more"
          />
          <template #overlay>
            <Menu>
              <MenuItem class="!text-blue" @click="emits('editRow', record.id)">
                {{ t('edit') }}
                <template #icon>
                  <Icon icon="tabler:edit" />
                </template>
              </MenuItem>
              <MenuItem class="!text-blue" @click="emits('deleteRow', record.id)">
                {{ t('delete') }} <!-- Corrected to delete -->
                <template #icon>
                  <Icon icon="tabler:trash" />
                </template>
              </MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </template>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { Table, Dropdown, Menu, MenuItem, Select, SelectOption } from 'ant-design-vue/es'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import AMButton from './AMButton.vue'

const { t } = useI18n()

interface Props {
  label: string
}

const props = withDefaults(defineProps<Props>(), {
  label: ''
})

const emits = defineEmits(['addRow', 'editRow', 'deleteRow'])
const changePaginate = () => {}
const paginate = ref({
  pageSize: 5
})
</script>
