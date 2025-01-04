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
      <div class="flex items-center justify-end">
        <Divider type="vertical" />
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
        <Tooltip title="فیلتر جدول" size="small">
          <Badge :count="filteredCount">
            <AzButton type="link" size="small" @click="filterMode.toggle" icon="tabler:filter">
              فیلتر
            </AzButton>
          </Badge>
        </Tooltip>
        <Divider type="vertical" />
        <Tooltip title="بزرگنمایی">
          <AzFullScreen @click="toggleFullScreen" />
        </Tooltip>
        <Divider type="vertical" />
        <Tooltip title="ریست جدول" size="small">
          <AzButton type="link" size="small" @click="resetTable" icon="tabler:refresh" />
        </Tooltip>
      </div>

      <Transition name="slide">
        <Card
          class="py-4 bg-gray-50"
          v-if="filterMode.isOpen.value"
          title="لیست فیلترها"
          size="small"
        >
          <template #extra>
            <AzButton type="text" danger icon="tabler:x" @click="filterMode.toggle" />
          </template>
          <Form layout="vertical">
            <div class="grid grid-cols-4 gap-x-4">
              <FormItem :label="item.title" v-for="(item, index) in props.filterList" :key="index">
                <div class="">
                  <Input
                    v-if="item.type === FilterTypeEnum.STRING"
                    v-model:value="item.value"
                    allow-clear
                  />
                  <InputNumber
                    v-if="item.type === FilterTypeEnum.NUMBER"
                    v-model:value="item.value"
                    allow-clear
                  />
                  <Switch
                    v-if="item.type === FilterTypeEnum.BOOLEAN"
                    v-model:checked="item.value"
                    allow-clear
                  />
                  <RangePicker
                    v-if="item.type === FilterTypeEnum.DATE"
                    v-model:value="item.value"
                    :placeholder="[t('startDate'), t('endDate')]"
                  />
                </div>
              </FormItem>
            </div>
          </Form>

          <Divider />
          <div class="flex justify-end gap-x-4">
            <AzButton type="text" @click="resetFilter">بازنشانی</AzButton>
            <AzButton type="primary" @click="submitFilter">جستجو</AzButton>
          </div>
        </Card>
      </Transition>
    </template>

    <template #bodyCell="{ value, column, record, index }">
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
import type { PaginationConfig } from 'ant-design-vue/es/pagination'
import type { ColumnsType, TablePaginationConfig, TableProps } from 'ant-design-vue/es/table'
import type {
  FilterValue,
  SorterResult,
  TableCurrentDataSource
} from 'ant-design-vue/lib/table/interface'
import {
  Card,
  Table,
  Divider,
  RangePicker,
  Tooltip,
  Input,
  InputNumber,
  Switch,
  Form,
  FormItem,
  Badge,
  InputSearch
} from 'ant-design-vue/es'
import { useFullscreen } from '@vueuse/core'
import { ref, onMounted, reactive, computed } from 'vue'
import { formatDate } from '@/core/utils'
import { AzButton, AzFullScreen, AzStatus } from '@/core/components'
import { useI18n } from 'vue-i18n'
import { isNull, isUndefined, truncate } from 'lodash'
import { FilterTypeEnum, SortDirEnum } from '@/core/enums'
import { useModal } from '@/core/composable'
import { Icon } from '@iconify/vue'
interface FilterList {
  title: string
  key: string
  type: FilterTypeEnum
  value: any
}
interface Props {
  columns: ColumnsType
  filterList: FilterList[]
  fetch: Function
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

const resetFilter = () => {
  props.filterList.map((item) => {
    delete item.value
  })
  resetTable()
}
const filteredCount = computed(() => {
  return props.filterList?.filter((item) => {
    if (!isUndefined(item.value) && !isNull(item.value)) {
      return item
    }
  }).length
})
const submitFilter = () => {
  const obj: any = {}
  props.filterList.forEach((item) => {
    return (obj[item.key] = item.value)
  })
  currentData.value = fetchData({
    size: pagination.pageSize,
    page: pagination.current - 1,
    ...obj
  })
}

onMounted(async () => {
  await fetchData({
    size: pagination.pageSize,
    page: pagination.current - 1
  })
})

defineExpose({
  reload: resetTable
})

const filterMode = useModal()
</script>
<style lang="less">
// .az-table-column-sorter {
//   &:has(.anticon) {
//     display: none;
//     &:hover {
//       display: flex;
//     }
//   }
//   &:has(.anticon.active) {
//     display: flex;
//   }
// }
</style>
