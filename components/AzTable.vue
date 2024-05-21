<template>
  <draggable v-model="draggableColumns" :options="{ handle: '.drag-handle' }">
    <template #item="{ element }">
      <th class="drag-handle">{{ element.title }}</th>
    </template>
  </draggable>
  <Table
    :loading="loading"
    :columns="draggableColumns"
    :data-source="data"
    :pagination="pagination"
    @change="handleTableChange"
    stripe
    bordered
    auto-header-height
    prefixCls="az-table"
    ref="azTableRef"
  >
    <template #title>
      <div class="flex-1">
        <InputSearch class="min-w-100 w-96" />
      </div>
      <Divider type="vertical" />
      <AzFullScreen @click="toggle" />
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'enabled'">
        <AzStatus :status="record.enabled" />
      </template>
      <slot name="amir" :column="column" :record="record" />
    </template>
  </Table>
</template>
<script setup lang="ts">
import { Table, InputSearch, Divider } from "ant-design-vue/es";
import useAxios from "@/core/services/axios";
import { useFullscreen, useOffsetPagination } from "@vueuse/core";
import { ref, onMounted, reactive } from "vue";
import type {
  ColumnsType,
  TablePaginationConfig,
  TableProps,
} from "ant-design-vue/es/table";
import { formatDate } from "@/core/utils";
import { AzFullScreen, AzStatus } from "@/core/components";
import type {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from "ant-design-vue/lib/table/interface";
import draggable from "vuedraggable";

interface Props {
  url: string;
  columns: ColumnsType;
}
const azTableRef = ref<HTMLElement | null>(null);

const { toggle } = useFullscreen(azTableRef);

const props = withDefaults(defineProps<Props>(), {
  url: "",
  columns: () => [],
});
const draggableColumns = ref(props.columns);

const axios = useAxios();
const data = ref([]);
const fetchData = async (page: number, pageSize: number) => {
  try {
    const result = await axios.get({
      url: props.url,
      data: {
        size: pageSize,
        page: page,
      },
    });
    data.value = result.content.map((item: any, index: number) => {
      if (item["createdAt"]) {
        item["createdAt"] = formatDate(item["createdAt"]);
      }
      if (item["updatedAt"]) {
        item["updatedAt"] = formatDate(item["updatedAt"]);
      }
      if (item["expiredAt"]) {
        item["expiredAt"] = formatDate(item["expiredAt"]);
      }

      // if (item['enabled']) {
      //   item['expiredAt'] = formatDate(item['expiredAt'])
      // }

      return {
        ...item,
        row: index + 1,
        key: item.id,
      };
    });
    pagination.total = result.content.length;
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
  onPageChange: (_data) => {
    pagination.current = _data.currentPage;
    pagination.pageSize = _data.currentPageSize;
    fetchData(_data.currentPage, _data.currentPageSize);
  },
  onPageSizeChange: (_data) => {
    pagination.current = _data.currentPage;
    pagination.pageSize = _data.currentPageSize;
    fetchData(_data.currentPage, _data.currentPageSize);
  },
});

onMounted(() => {
  fetchData(currentPage.value, currentPageSize.value);
});
const loading = ref(false);

const handleTableChange: TableProps["onChange"] = (
  pag: TablePaginationConfig,
  filters: Record<string, FilterValue | null>,
  sorter: SorterResult<any> | SorterResult<any>[],
  extra: TableCurrentDataSource<any>
) => {
  pagination.current = pag.current ?? 1;
  pagination.pageSize = pag.pageSize ?? 1;
  loading.value = true;
  fetchData(pag.current ?? 1, pag.pageSize ?? 1);
  loading.value = false;
};
</script>
<style lang="less">
.az-table {
  .az-table-title {
    @apply flex  items-center;
  }
}
</style>
