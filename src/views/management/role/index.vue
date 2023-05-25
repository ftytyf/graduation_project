<template>
  <div class="h-full overflow-hidden">
    <n-card title="脏数据" :bordered="false" class="rounded-16px shadow-sm">
      <n-space class="pb-12px" justify="space-between">
        <n-space>
          <n-button type="primary" @click="handleAddTable">
            <icon-ic-round-plus class="mr-4px text-20px" />
            新增
          </n-button>
          <n-button
            v-model:value="checkedRowKeyRef"
            type="error"
            :disabled="deleteFlag"
            @click="handleDeleteTables(checkedRowKeyRef)"
          >
            <icon-ic-round-delete class="mr-4px text-20px" />
            删除
          </n-button>
          <!-- <n-button type="success" @click="getTableData('super', 'false')">
            <icon-uil:export class="mr-4px text-20px" />
            管理员
          </n-button> -->
        </n-space>
        <n-space align="center" :size="18">
          <n-button size="small" type="primary" @click="getTableData('super', 'true')">
            <icon-mdi-refresh class="mr-4px text-16px" :class="{ 'animate-spin': loading }" />
            刷新表格
          </n-button>
          <column-setting v-model:columns="columns" />
        </n-space>
      </n-space>
      <n-data-table
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :pagination="pagination"
        :row-key="rowKey"
        @update:checked-row-keys="handleCheck"/>
      <table-action-modal v-model:visible="visible" :type="modalType" :edit-data="editData" />
    </n-card>
  </div>
</template>

<script setup lang="tsx">
import { reactive, ref } from 'vue';
import type { Ref } from 'vue';
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui';
import type { DataTableColumns, PaginationProps } from 'naive-ui';
// import { genderLabels, userStatusLabels } from '@/constants';
import { fetchDataList } from '@/service';
import { fetchDatadel } from '@/service';
import { fetchDatadels } from '@/service';
import { useBoolean, useLoading } from '@/hooks';
import TableActionModal from './components/table-action-modal.vue';
import type { ModalType } from './components/table-action-modal.vue';
// eslint-disable-next-line import/no-unresolved
// import ColumnSetting from './components/column-setting.vue';

const { loading, startLoading, endLoading } = useLoading(false);
const { bool: visible, setTrue: openModal } = useBoolean();
const checkedRowKeyRef = ref([]);
const deleteFlag = ref(false);

const tableData = ref<UserManagement.Data[]>([]);
function setTableData(data: UserManagement.Data[]) {
  tableData.value = data;
}

async function getTableData() {
  startLoading();
  const { data } = await fetchDataList();
  if (data) {
    setTimeout(() => {
      console.log(data);
      setTableData(data);
      endLoading();
    }, 1000);
  }
}

function handleCheck(rowKeys) {
  checkedRowKeyRef.value = rowKeys;
  console.log('-=选中的复选框 id为', rowKeys);
  console.log(checkedRowKeyRef.value);
  const valuelist = Object.keys(rowKeys);
  if (valuelist.length === 0) deleteFlag.value = true;
  else deleteFlag.value = false;
}

const columns: Ref<DataTableColumns<UserManagement.Data>> = ref([
  {
    type: 'selection',
    align: 'center'
  },

  // {
  //   key: 'gender',
  //   title: '性别',
  //   align: 'center',
  //   render: row => {
  //     if (row.gender) {
  //       const tagTypes: Record<UserManagement.GenderKey, NaiveUI.ThemeColor> = {
  //         '0': 'success',
  //         '1': 'warning'
  //       };

  //       return <NTag type={tagTypes[row.gender]}>{genderLabels[row.gender]}</NTag>;
  //     }

  //     return <span></span>;
  //   }
  // },
  {
    key: 'index',
    title: 'index',
    align: 'center'
  },
  {
    key: 'id',
    title: 'id',
    align: 'center'
  },
  {
    key: 'beer_name',
    title: 'beer_name',
    align: 'center'
  },
  {
    key: 'style',
    title: 'style',
    align: 'center'
  },
  {
    key: 'ounces',
    title: 'ounces',
    align: 'center'
  },
  {
    key: 'abv',
    title: 'abv',
    align: 'center'
  },
  {
    key: 'brewery_id',
    title: 'breweery_id',
    align: 'center'
  },
  {
    key: 'brewery_name',
    title: 'breweery_name',
    align: 'center'
  },
  {
    key: 'city',
    title: 'city',
    align: 'center'
  },
  {
    key: 'state',
    title: 'state',
    align: 'center'
  },
  {
    key: 'actions',
    title: '操作',
    align: 'center',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NButton size={'small'} onClick={() => handleEditTable(row.id)}>
            编辑
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDeleteTable(row.index)}>
            {{
              default: () => '确认删除',
              trigger: () => <NButton size={'small'}>删除</NButton>
            }}
          </NPopconfirm>
        </NSpace>
      );
    }
  }
]) as Ref<DataTableColumns<UserManagement.Data>>;

const modalType = ref<ModalType>('add');

function setModalType(type: ModalType) {
  modalType.value = type;
}

const editData = ref<UserManagement.Data | null>(null);

function setEditData(data: UserManagement.Data | null) {
  editData.value = data;
}

function handleAddTable() {
  openModal();
  setModalType('add');
}

function handleEditTable(rowId: string) {
  const findItem = tableData.value.find(item => item.id === rowId);
  if (findItem) {
    setEditData(findItem);
  }
  setModalType('edit');
  openModal();
}

async function handleDeleteTable(index: string) {
  await fetchDatadel(index);
  getTableData();
  window.$message?.info(`删除成功`);
}

async function handleDeleteTables(rowKeys) {
  const headerlist = Object.keys(rowKeys);
  const result = [];

  for (let i = 0; i < headerlist.length; i++) {
    result.push(rowKeys[headerlist[i]]);
  }
  await fetchDatadels(result);
  getTableData();
  window.$message?.info(`删除成功`);
}
const pagination: PaginationProps = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 15, 20, 25, 30],
  onChange: (page: number) => {
    pagination.page = page;
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
  }
});

function init() {
  getTableData();
	console.log(1);
}

// 初始化
init();

</script>

<style scoped></style>
