<template>
  <Table
    :loading="loading"
    :columns="columns"
    :data-source="data"
    :pagination="pagination"
    @change="handleTableChange"
    stripe
    bordered
    auto-header-height
  />
</template>
<script setup lang="ts">
import { Table } from 'ant-design-vue'
import useAxios from '../services/axios'
import { useOffsetPagination } from '@vueuse/core'
import { ref, onMounted, reactive } from 'vue'
import type { ColumnsType, TablePaginationConfig } from 'ant-design-vue/es/table'
interface Props {
  url: string
  columns: ColumnsType
}

const props = withDefaults(defineProps<Props>(), {
  url: '',
  columns: () => []
})

const axios = useAxios()
const data = ref([])
const fetchData = async (page: number, pageSize: number) => {
  try {
    const result = await axios.post({
      url: props.url,
      data: {
        size: pageSize,
        page: page
      }
    })
    data.value = result.data.map((item: any) => ({
      ...item,
      key: item.id
    }))
    pagination.total = result.content.length
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const pagination = reactive({
  showSizeChanger: true,
  showQuickJumper: true,
  defaultPageSize: 5,
  pageSizeOptions: [5, 10, 20, 30, 50],
  current: 1,
  pageSize: 5,
  total: 0
})

const { currentPage, currentPageSize } = useOffsetPagination({
  total: 0,
  page: 1,
  pageSize: 5,
  onPageChange: (_data) => {
    pagination.current = _data.currentPage
    pagination.pageSize = _data.currentPageSize
    fetchData(_data.currentPage, _data.currentPageSize)
  },
  onPageSizeChange: (_data) => {
    pagination.current = _data.currentPage
    pagination.pageSize = _data.currentPageSize
    fetchData(_data.currentPage, _data.currentPageSize)
  }
})

onMounted(() => {
  fetchData(currentPage.value, currentPageSize.value)
})
const loading = ref(false)
const handleTableChange = (pag: TablePaginationConfig) => {
  pagination.current = pag.current ?? 1
  pagination.pageSize = pag.pageSize ?? 1
  loading.value = true
  fetchData(pag.current ?? 1, pag.pageSize ?? 1)
  loading.value = false
}
</script>
