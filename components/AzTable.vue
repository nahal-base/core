<template>
  <div class="container">
    <STable
      :loading="loading"
      :columns="columns"
      :data-source="data"
      :pagination="pagination"
      @change="handleTableChange"
      stripe
      bordered
      auto-header-height
    >
      <template #title>
        <div class="">sdf</div>
      </template>
      <template #footer>
        <span style="color: blue">Footer</span>
      </template>

      <template #headerCell="{ column }">
        <template v-if="column.key === 'name'">
          <span style="color: #1677ff">Name</span>
        </template>
        <template v-else>{{ column.title }}</template>
      </template>
      <template
        #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
      >
        <div style="padding: 8px">
          <Input
            ref="searchInput"
            :placeholder="`Search ${column.dataIndex}`"
            :value="selectedKeys[0]"
            style="width: 188px; margin-bottom: 8px; display: block"
            @change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
            @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
          />
          <Button
            type="primary"
            size="small"
            style="width: 90px; margin-right: 8px"
            @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
          >
            <template #icon><search-outlined /></template>
            Search
          </Button>
          <Button size="small" style="width: 90px" @click="handleReset(clearFilters)">
            Reset
          </Button>
        </div>
      </template>
      <template #customFilterIcon="{ filtered }">
        <search-outlined :style="{ color: filtered ? '#108ee9' : undefined }" />
      </template>
      <template #bodyCell="{ text, column }">
        <span v-if="searchText && searchedColumn === column.dataIndex">
          <template
            v-for="(fragment, i) in text
              .toString()
              .split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
          >
            <mark
              v-if="fragment.toLowerCase() === searchText.toLowerCase()"
              :key="i"
              class="highlight"
            >
              {{ fragment }}
            </mark>
            <template v-else>{{ fragment }}</template>
          </template>
        </span>
        <template v-else>
          {{ text }}
        </template>
      </template>
    </STable>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { STable, setLicenseKey } from '@surely-vue/table'
import { SearchOutlined } from '@ant-design/icons-vue';
import { Button, Input } from 'ant-design-vue'
import axios from 'axios'
import { useOffsetPagination } from '@vueuse/core'

setLicenseKey(
  'bd8e9bae80c43b524960987020b1f47dT1JERVI6MDAwMDEsRVhQSVJZPTMzMjI3NzEyMDAwMDAwLERPTUFJTj1zdXJlbHkuY29vbCxLRVlWRVJTSU9OPTE='
)

const columns = ref([
  { title: 'ID', dataIndex: 'id', key: 'id', fixed: 'left', width: 150, resizable: true, rowDrag: true, drag: true },
  { title: 'Name', dataIndex: 'name', key: 'name', drag: true, customFilterDropdown: true,
    onFilter: (value, record) =>
      record.name.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: open => {
      if (open) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    }, },
  { title: 'Username', dataIndex: 'username', key: 'username', drag: true },
  { title: 'Email', dataIndex: 'email', key: 'email', drag: true }
])

const data = ref([])

const fetchData = async (page: number, pageSize: number) => {
  try {
    const result = await axios.get('https://jsonplaceholder.typicode.com/users', {
      params: {
        _limit: pageSize,
        _page: page,
      }
    })
    data.value = result.data.map((item: any) => ({
      ...item,
      key: item.id
    }))
    pagination.value.total = parseInt(result.headers['x-total-count'], 10)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const pagination = reactive({
  showSizeChanger: data.value.length > 0,
  defaultPageSize: 5,
  pageSizeOptions: [5, 10, 20, 30, 50],
  showQuickJumper: true,
  current: 1,
  pageSize: 5,
  total: 0
})

const { currentPage, currentPageSize } = useOffsetPagination({
  total: 0,
  page: 1,
  pageSize: 5,
  onPageChange: (page) => {
    pagination.current = page
    fetchData(page, currentPageSize.value)
  },
  onPageSizeChange: (pageSize) => {
    pagination.pageSize = pageSize
    fetchData(currentPage.value, pageSize)
  },
})

onMounted(() => {
  fetchData(currentPage.value, currentPageSize.value)
})

const loading = ref(false)
const handleTableChange = async (pag, filters, sorter) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  loading.value = true
  await fetchData(pag.current, pag.pageSize)
  loading.value = false
}

const state = reactive({
  searchText: '',
  searchedColumn: '',
})
const searchInput = ref()

const handleSearch = (selectedKeys, confirm, dataIndex) => {
  confirm()
  state.searchText = selectedKeys[0]
  state.searchedColumn = dataIndex
}

const handleReset = clearFilters => {
  clearFilters()
  state.searchText = ''
}
</script>

<style lang="less" scoped>
.container {
  margin-inline: auto;
  width: 90%;
}
.am--- {
  display: flex;
  background-color: mediumvioletred;
}
</style>
