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
import { Table } from "ant-design-vue";
import useAxios from "../services/axios";
import { useOffsetPagination } from "@vueuse/core";
import { ref, onMounted, reactive } from "vue";
interface Props {
  url: string;
}

const props = withDefaults(defineProps<Props>(), {
  url: "",
});

const axios = useAxios();
const data = ref([]);
const fetchData = async (page: number, pageSize: number) => {
  try {
    const result = await axios.post({
      url: props.url,
      data: {
        size: pageSize,
        page: page,
      },
    });
    data.value = result.data.map((item: any) => ({
      ...item,
      key: item.id,
    }));
    pagination.value.total = result.content.length;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const pagination = reactive({
  showSizeChanger: true,
  showQuickJumper: true,
  defaultPageSize: 5,
  pageSizeOptions: [5, 10, 20, 30, 50],
  current: 1,
  pageSize: 5,
  total: 0,
});

const { currentPage, currentPageSize } = useOffsetPagination({
  total: 0,
  page: 1,
  pageSize: 5,
  onPageChange: (page) => {
    pagination.current = page;
    fetchData(page, currentPageSize.value);
  },
  onPageSizeChange: (pageSize) => {
    pagination.pageSize = pageSize;
    fetchData(currentPage.value, pageSize);
  },
});

onMounted(() => {
  fetchData(currentPage.value, currentPageSize.value);
});
const loading = ref(false);
const handleTableChange = (pag, filters, sorter) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
  loading.value = true;
  fetchData(pag.current, pag.pageSize);
  loading.value = false;
};
</script>
