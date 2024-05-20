<template>
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
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { STable, setLicenseKey } from '@surely-vue/table'
import { SearchOutlined } from '@ant-design/icons-vue';
import {Button,Input}  from 'ant-design-vue'
import { reactive } from 'vue';
import "@/core/assets/styles/table.css"
setLicenseKey(
  'bd8e9bae80c43b524960987020b1f47dT1JERVI6MDAwMDEsRVhQSVJZPTMzMjI3NzEyMDAwMDAwLERPTUFJTj1zdXJlbHkuY29vbCxLRVlWRVJTSU9OPTE='
)
import useAxios from '@/core/services/axios'

const axios = useAxios()

// Ensure each column has a unique key
const columns = ref([
  { title: 'ID', dataIndex: 'id', key: 'id',   fixed: 'left', width: 150, resizable: true, rowDrag: true ,drag :true },
  { title: 'Name', dataIndex: 'name', key: 'name',drag :true,     customFilterDropdown: true,
    onFilter: (value, record) =>
      record.name.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: open => {
      if (open) {
        setTimeout(() => {
          searchInput.value.focus();
        }, 100);
      }
    }, },
  { title: 'Username', dataIndex: 'username', key: 'username',drag :true },
  { title: 'Email', dataIndex: 'email', key: 'email',drag :true }
])

const data = ref([])

type APIParams = {
  results: number
  page?: number
  sortField?: string
  sortOrder?: string
  [key: string]: any
}

const fetchData = async (params: APIParams = { results: 10, page: 1 }) => {
  try {
    const result = await axios.get('http://10.0.202.34:8090/api/plan/getAll')
    console.log("🚀 ~ fetchData ~ result:", result)
    // data.value = result.data.map((item: any) => ({
    //   ...item,
    //   key: item.id // Ensure each row has a unique key
    // }))
    pagination.value.total = parseInt(result.headers['x-total-count'], 10)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

onMounted(() => {
  fetchData()
})

const pagination = ref({
  showSizeChanger: data.value.length > 0,
  defaultPageSize: 5,
  pageSizeOptions: [5, 10, 20, 30, 50],
  showQuickJumper: true,
  locale: 'fa',
  responsive: true,
  showLessItems: true,
  current: 1,
  pageSize: 5,
  total: 0
})
const loading =ref(false)
const handleTableChange = async(
  pag: { pageSize: number; current: number },
  filters: any,
  sorter: any
) => {
  pagination.value.current = pag.current
  pagination.value.pageSize = pag.pageSize
  loading.value = !loading.value
  await fetchData({
    results: pag.pageSize,
    page: pag.current,
    sortField: sorter.field,
    sortOrder: sorter.order,
    ...filters
  })
  loading.value = !loading.value
}
const state = reactive({
  searchText: '',
  searchedColumn: '',
});
const searchInput = ref();

const handleSearch = (selectedKeys, confirm, dataIndex) => {
  confirm();
  state.searchText = selectedKeys[0];
  state.searchedColumn = dataIndex;
};

const handleReset = clearFilters => {
  clearFilters();
  state.searchText = '';
};

</script>
