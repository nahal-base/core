<template>
  <Table
    :loading="loading"
    :columns="props.columns"
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
      <div class="flex-1" ></div>

      <AzButton type="link" size="small" @click="emits('addToggle')" icon="tabler:plus">
        {{ t('add') }}
      </AzButton>
      <slot name="addForm" />
      <Divider type="vertical" />
      <AzFullScreen @click="toggle" />
    </template>

    <template
      #customFilterDropdown="{
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        column,
      }"
    >
      <div class="p-4">
        <Input
          ref="searchInput"
          :placeholder="`Search ${column.dataIndex}`"
          :value="selectedKeys[0]"
          style="width: 188px; margin-bottom: 8px; display: block"
          @change="
            (e) => setSelectedKeys(e.target.value ? [e.target.value] : [])
          "
          @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
        />
        <div class="grid grid-cols-2 gap-2">
          <AzButton
            type="primary"
            size="small"
            @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
            icon="tabler:search"
          >
            {{ t("search") }}
          </AzButton>
          <AzButton size="small" @click="handleReset(clearFilters)"
            >{{ t("reset") }}
          </AzButton>
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
      <slot name="amir" :column="column" :record="record" />
    </template>
  </Table>
</template>
<script setup lang="ts">
import type {
  ColumnsType,
  TablePaginationConfig,
  TableProps,
} from "ant-design-vue/es/table";
import type {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from "ant-design-vue/lib/table/interface";
import { Table, Divider, Input } from "ant-design-vue/es";
import { useAxios } from "@/core/services/axios";
import { useFullscreen, useOffsetPagination } from "@vueuse/core";
import { ref, onMounted, reactive } from "vue";
import { formatDate } from "@/core/utils";
import { AzButton, AzFullScreen, AzStatus } from "@/core/components";
import { Icon } from "@iconify/vue/dist/iconify.js";
import { useI18n } from "vue-i18n";

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
 const emits =defineEmits(['addToggle'])
const axios = useAxios();
const data = ref([]);
const loading = ref(false);
const { t } = useI18n();
const fetchData = async () => {
  loading.value = true;

  try {
    const result = await axios.post({
      url: props.url,
      data: {
        size: pagination.pageSize,
        page: pagination.current - 1,
        sortDir: sort.dir,
        sortBy: sort.by,
        [state.searchedColumn]: state.searchText,
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

      return {
        ...item,
        row: index + 1,
        key: item.id,
      };
    });
    pagination.total = result.totalElements;
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    loading.value = false;
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
  onPageChange: (_data) => {
    pagination.current = _data.currentPage;
    pagination.pageSize = _data.currentPageSize;
  },
  onPageSizeChange: (_data) => {
    pagination.current = _data.currentPage;
    pagination.pageSize = _data.currentPageSize;
  },
});

const sort = reactive({
  dir: undefined,
  by: undefined,
});

const handleTableChange: TableProps["onChange"] = (
  pag: TablePaginationConfig,
  filters: Record<string, FilterValue | null>,
  sorter: SorterResult<any> | SorterResult<any>[],
  extra: TableCurrentDataSource<any>
) => {
  pagination.current = pag.current ?? 1;
  pagination.pageSize = pag.pageSize ?? 1;
  sort.dir = sorter.order === "ascend" ? "asc" : "desc";
  sort.by = sorter.columnKey;
  fetchData();
};

const state = reactive<any>({
  searchText: undefined,
  searchedColumn: undefined,
});
const handleSearch = (
  selectedKeys: string[],
  confirm: () => void,
  dataIndex: string
) => {
  confirm();
  state.searchText = selectedKeys[0];
  state.searchedColumn = dataIndex;
  fetchData();
};

const handleReset = (clearFilters: (arg0: { confirm: boolean }) => void) => {
  clearFilters({ confirm: true });
  state.searchText = undefined;
  state.searchedColumn = undefined;
  fetchData();
};
onMounted(async () => await fetchData());
</script>
<style lang="less">
.az-table {
  .az-table-title {
    @apply flex  items-center;
  }
}
</style>
