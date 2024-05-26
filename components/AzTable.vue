<template>
  {{ data }}
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
  >
    <template #title>
      <div class="flex-1"></div>
      <AzButton type="link" size="small" @click="emits('addToggle')" icon="tabler:plus">
        {{ t('add') }}
      </AzButton>
      <slot name="addForm" />
      <Divider type="vertical" />
      <AzFullScreen @click="toggleFullScreen" />
    </template>

    <template
      #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
    >
      {{ state }}
      <div class="p-4">
        <RangePicker
          v-if="isDateColumn(column.dataIndex)"
          showToday
          format="YYYY-MM-DD HH:mm"
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

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'enabled'">
        <AzStatus :status="record.enabled" />
      </template>
      <slot name="bodyCellSlot" :column="column" :record="record" />
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
import { Table, Divider, Input, RangePicker } from 'ant-design-vue/es'
import { useAxios } from '@/core/services/axios'
import { useFullscreen } from '@vueuse/core'
import { ref, onMounted, reactive, computed } from 'vue'
import { formatDate } from '@/core/utils'
import { AzButton, AzFullScreen, AzStatus } from '@/core/components'
import { Icon } from '@iconify/vue/dist/iconify.js'
import { useI18n } from 'vue-i18n'
import { isString, truncate } from 'lodash'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

interface Props {
  url: string
  columns: ColumnsType
}

const azTableRef = ref<HTMLElement | null>(null)
const { toggle: toggleFullScreen } = useFullscreen(azTableRef)
const props = defineProps<Props>()
const emits = defineEmits(['addToggle'])
const axios = useAxios()
const data = ref([])
const loading = ref(false)
const { t } = useI18n()

const computedColumns = computed(() => {
  return [{ title: t('row'), dataIndex: 'row', key: 'row' }, ...props.columns]
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
// const offsetPagination = useOffsetPagination({
//   total: pagination.total,
//   pageSize: pagination.defaultPageSize,
//   onPageChange: (newPage) => {
//     pagination.current = newPage.currentPage
//     fetchData()
//   },
//   onPageSizeChange: (newSize) => {
//     pagination.pageSize = newSize.currentPageSize
//     pagination.current = 1
//     fetchData()
//   }
// })

const sort = reactive<any>({
  dir: undefined,
  by: undefined
})

const state = reactive<any>({
  value: undefined,
  label: undefined
})

const fetchData = async () => {
  loading.value = true
  try {
    const { content, totalElements } = await axios.post({
      url: props.url,
      data: {
        size: pagination.pageSize,
        page: pagination.current - 1,
        sortDir: sort.dir,
        sortBy: sort.by,
        [state.label]: state.value
      }
    })

    data.value = content.map((item: any, index: number) => ({
      ...item,
      ...Object.keys(item).reduce((acc: any, key) => {
        if (isString(item[key])) acc[key] = truncate(item[key], { length: 30 })
        return acc
      }, {}),
      row: (pagination.current - 1) * pagination.pageSize + index + 1,
      key: item.id,
      createdAt: item.createdAt ? formatDate(item.createdAt) : undefined,
      updatedAt: item.updatedAt ? formatDate(item.updatedAt) : undefined,
      expiredAt: item.expiredAt ? formatDate(item.expiredAt) : undefined
    }))

    pagination.total = totalElements
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
}

const handleTableChange: TableProps['onChange'] = (
  pag: TablePaginationConfig,
  filters: Record<string, FilterValue | null>,
  sorter: SorterResult<any> | SorterResult<any>[],
  extra: TableCurrentDataSource<any>
) => {
  pagination.current = pag.current ?? 1
  pagination.pageSize = pag.pageSize ?? 5
  sort.dir = Array.isArray(sorter) ? sorter[0]?.order : sorter?.order
  sort.dir = sort.dir === 'ascend' ? 'asc' : 'desc'
  if (sort.dir) {
    sort.by = Array.isArray(sorter) ? sorter[0]?.columnKey : sorter?.columnKey
  } else {
    sort.by = undefined
  }
  fetchData()
}

const resetState = () => {
  state.value = undefined
  state.label = undefined
}
const handleTimeSubmit = (selectedKeys: string[], confirm: () => void, dataIndex: string) => {
  console.log('🚀 ~ handleTimeSubmit ~ selectedKeys:', selectedKeys)
  confirm()
  state.value = selectedKeys[0]
    ? [dayjs(selectedKeys[0][0]).format(), dayjs(selectedKeys[0][1]).format()]
    : undefined
  state.label = dataIndex
  fetchData()
}

const handleSubmit = (selectedKeys: string[], confirm: () => void, dataIndex: string) => {
  console.log("🚀 ~ handleSubmit ~ selectedKeys:", selectedKeys)
  confirm()
  state.value = selectedKeys[0]
  state.label = dataIndex
  fetchData()
}

const handleReset = (clearFilters: (arg0: { confirm: boolean }) => void) => {
  clearFilters({ confirm: true })
  resetState()
  fetchData()
}

const isDateColumn = (dataIndex: string) => ['createdAt', 'updatedAt'].includes(dataIndex)

onMounted(fetchData)
</script>

<style lang="less">
.az-table {
  .az-table-title {
    display: flex;
    align-items: center;
  }
}
</style>
