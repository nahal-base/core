<template>
  <Table
    :loading="loading"
    :columns="computedColumns"
    :data-source="data"
    :pagination="pagination"
    @change="handleTableChange"
    stripe
    auto-header-height
    prefixCls="az-table"
    ref="azTableRef"
    :class="{ 'bg-white p-4': isFullscreen }"
    :scroll="{ x: 1000 }"
  >
    <template #title>
      <div class="flex-1"></div>
      <Tooltip title="افزودن رکورد">
        <AzButton
          v-if="$slots.addForm"
          type="link"
          size="small"
          @click="emits('addToggle')"
          icon="tabler:plus"
        >
          {{ t('add') }}
        </AzButton>
        <slot name="addForm" />
      </Tooltip>
      <Divider type="vertical" />
      <Tooltip title="بزرگنمایی">
        <AzFullScreen @click="toggleFullScreen" />
      </Tooltip>
      <Divider type="vertical" />
      <Tooltip title="ریست جدول" size="small">
        <AzButton type="link" size="small" @click="resetTable" icon="tabler:refresh" />
      </Tooltip>
    </template>

    <template
      #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
    >
      <div class="p-4">
        <RangePicker
          v-if="isDateColumn(column.dataIndex)"
          class="w-80 mb-4"
          :placeholder="[t('startDate'), t('endDate')]"
          :value="selectedKeys[0]"
          @change="(e) => setSelectedKeys(e ? [e] : [])"
        />
        <Input
          v-else
          ref="searchInput"
          :placeholder="`جستجو در ${t(column.dataIndex)}`"
          :value="selectedKeys[0]"
          class="mb-4"
          @change="(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])"
        />
        <div class="grid grid-cols-2 gap-2">
          <AzButton
            type="primary"
            @click="() => handleSubmit(selectedKeys, confirm, column.dataIndex)"
            icon="tabler:search"
          >
            {{ t('filter') }}
          </AzButton>
          <AzButton @click="() => handleReset(clearFilters)">{{ t('reset') }}</AzButton>
        </div>
      </div>
    </template>

    <template #customFilterIcon="{ filtered }">
      <Icon icon="tabler:search" :class="filtered ? 'text-blue' : undefined" />
    </template>

    <template #bodyCell="{ text, value, column, record, index }">
      <slot name="bodyCell" :column="column" :record="record">
        <template
          v-if="
            column.key !== 'row' &&
            column.key !== 'id' &&
            column.key !== 'updatedAt' &&
            column.key !== 'createdAt' &&
            column.key !== 'expiredAt' &&
            column.key !== 'enabled'
          "
        >
          {{ truncate(value, { length: 50 }) }}
        </template>
        <template v-if="column.key === 'row'">
          {{ (pagination.current - 1) * pagination.pageSize + index + 1 }}
        </template>
        <template v-if="column.key === 'enabled'">
          <AzStatus :status="value" />
        </template>
        <template v-if="column.key === 'updatedAt'">
          {{ formatDate(value) }}
        </template>
        <template v-if="column.key === 'createdAt'">
          {{ formatDate(value) }}
        </template>
        <template v-if="column.key === 'expiredAt'">
          {{ formatDate(value) }}
        </template>
        <template v-if="column.key === 'startedAt'">
          {{ formatDate(value) }}
        </template>
      </slot>
    </template>
  </Table>
</template>

<script setup lang="ts">
import type { ColumnsType, TablePaginationConfig, TableProps } from 'ant-design-vue/es/table'
import type {
  FilterValue,
  SorterResult,
  TableCurrentDataSource
} from 'ant-design-vue/lib/table/interface'
import { Table, Divider, Input, RangePicker, Tooltip } from 'ant-design-vue/es'
import { useFullscreen } from '@vueuse/core'
import { ref, onMounted, reactive, computed, watch } from 'vue'
import { formatDate } from '@/core/utils'
import { AzButton, AzFullScreen, AzStatus } from '@/core/components'
import { Icon } from '@iconify/vue/dist/iconify.js'
import { useI18n } from 'vue-i18n'
import { isFunction, isString, truncate } from 'lodash'
import dayjs from 'dayjs'
import type { PaginationConfig } from 'ant-design-vue/es/pagination'
import { SortDirEnum } from '@/core/enums'

interface Props {
  columns: ColumnsType
  fetch: Function
  reloadFlag: boolean
}

const azTableRef = ref<HTMLElement | null>(null)
const { toggle: toggleFullScreen, isFullscreen } = useFullscreen(azTableRef)
const props = defineProps<Props>()
const emits = defineEmits(['addToggle'])
const data = ref([])
const loading = ref(false)
const { t } = useI18n()

const computedColumns = computed(() => {
  return [{ title: t('row'), dataIndex: 'row', key: 'row', width: 'max-content' }, ...props.columns]
})

const pagination = reactive({
  showSizeChanger: true,
  showQuickJumper: true,
  defaultPageSize: 5,
  pageSizeOptions: [5, 10, 20, 30, 50],
  current: 1,
  pageSize: 5,
  total: 0
})

const state = reactive<any>({
  value: undefined,
  label: undefined
})
const currentData = ref({})
const fetchData = async (_input: unknown) => {
  loading.value = true

  try {
    const { content, totalElements } = await props.fetch(_input)
    data.value = content
    pagination.total = totalElements
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
}

const resetTable = async () => {
  await fetchData({
    size: pagination.pageSize,
    page: pagination.current - 1
  })
}
interface SortParams {
  sortBy?: string
  sortDir?: string
}

const getSortParams = (sorter: SorterResult<any> | SorterResult<any>[] | null): SortParams => {
  if (!sorter) return {}
  const { order, columnKey } = Array.isArray(sorter) ? sorter[0] : sorter

  return {
    sortBy: order ? String(columnKey) : undefined,
    sortDir: order
      ? order === 'ascend' && columnKey
        ? SortDirEnum.ASCENDING
        : SortDirEnum.DESCENDING
      : undefined
  }
}

const updatePagination = (pag: TablePaginationConfig, pagination: PaginationConfig) => {
  pagination.current = pag.current ?? 1
  pagination.pageSize = pag.pageSize ?? 5
}
const handleTableChange: TableProps['onChange'] = (
  pag: TablePaginationConfig,
  filters: Record<string, FilterValue | null>,
  sorter: SorterResult<any> | SorterResult<any>[],
  extra: TableCurrentDataSource<any>
) => {
  updatePagination(pag, pagination)

  const { sortBy, sortDir } = getSortParams(sorter)
  currentData.value = fetchData({
    size: pagination.pageSize,
    page: pagination.current - 1,
    sortBy,
    sortDir,
    ...filters,
    ...extra
  })
}

const resetState = () => {
  state.value = undefined
  state.label = undefined
}
const handleTimeSubmit = (selectedKeys: string[], confirm: () => void, dataIndex: string) => {
  confirm()
  state.value = selectedKeys[0]
    ? [dayjs(selectedKeys[0][0]).format(), dayjs(selectedKeys[0][1]).format()]
    : undefined
  state.label = dataIndex

  fetchData({
    size: pagination.pageSize,
    page: pagination.current - 1,
    [state.label]: state.value
  })
}

const handleSubmit = (selectedKeys: string[], confirm: () => void, dataIndex: string) => {
  state.value = selectedKeys[0]
  state.label = dataIndex

  fetchData({
    size: pagination.pageSize,
    page: pagination.current - 1,
    [state.label]: state.value
  })
  // confirm()
}

const handleReset = (clearFilters: (arg0: { confirm: boolean }) => void) => {
  clearFilters({ confirm: true })
  resetState()

  fetchData({
    size: pagination.pageSize,
    page: pagination.current - 1
  })
}

const isDateColumn = (dataIndex: string) => ['createdAt', 'updatedAt'].includes(dataIndex)

onMounted(async () => {
  await fetchData({
    size: pagination.pageSize,
    page: pagination.current - 1
  })
})

watch(
  () => props.reloadFlag,
  async () => {
    await fetchData({
      size: pagination.pageSize,
      page: pagination.current - 1
    })
  }
)

// const childMethod = () => {
//   console.log('Method called from parent');
// };

defineExpose({
  resetTable,
});

</script>

<style lang="less">
.az-table {
  .az-table-title {
    display: flex;
    align-items: center;
  }
}
</style>
