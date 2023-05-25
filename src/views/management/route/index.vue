<template>
  <div class="h-full overflow-hidden">
    <n-card title="数据清洗" :bordered="false" class="rounded-16px shadow-sm">
      <n-space class="pb-12px" justify="space-between">
        <n-space>
          <n-button type="primary" @click="handleAddTable">
            <icon-ic-round-plus class="mr-4px text-20px" />
            新增
          </n-button>
          <n-button type="success" @click="autorepair()"> 自动清洗 </n-button>
          <n-button
            v-model:value="checkedRowKeyRef"
            type="error"
            :disabled="deleteFlag"
            @click="handleDeleteTables(checkedRowKeyRef)"
          >
            <icon-ic-round-delete class="mr-4px text-20px" />
            删除
          </n-button>
          <n-select v-model:value="value" :options="options" @update:value="handleUpdateValue" />
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
        @update:checked-row-keys="handleCheck"
      />
      <table-action-modal v-model:visible="visible" :type="modalType" :edit-data="editData" />
    </n-card>
    <n-modal v-model:show="showModal">
      <n-spin :show="showSpin">
        <n-card style="width: 600px" title="数据清洗" :bordered="false" size="huge" role="dialog" aria-modal="true">
          <n-form ref="formRef" size="large">
            <n-form-item label="abv">
              <n-select v-model:value="valueSelect1" :options="options_edit1" :consistent-menu-width="false" />
            </n-form-item>
            <n-form-item label="state">
              <n-select v-model:value="valueSelect2" :options="options_edit2" :consistent-menu-width="false" />
            </n-form-item>
            <n-form-item label="city">
              <n-select v-model:value="valueSelect3" :options="options_edit3" :consistent-menu-width="false" />
            </n-form-item>
            <n-form-item>
              <n-input v-model:value="valueSelect1" placeholder="请输入更改完的候选值" />
            </n-form-item>
            <n-form-item>
              <n-input v-model:value="valueSelect2" placeholder="请输入更改完的候选值" />
            </n-form-item>
            <n-form-item>
              <n-input v-model:value="valueSelect3" placeholder="请输入更改完的候选值" />
            </n-form-item>
            <n-form-item>
              <n-button @click="handleClick(valueSelect1, valueSelect2, valueSelect3)"> 修改 </n-button>
            </n-form-item>
          </n-form>
        </n-card>
      </n-spin>
    </n-modal>
  </div>
</template>

<script setup lang="tsx">
import { request } from 'http';
import { reactive, ref } from 'vue';
import type { Ref } from 'vue';
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui';
import type { DataTableColumns, PaginationProps } from 'naive-ui';
// import { genderLabels, userStatusLabels } from '@/constants';
import { fetchDataList } from '@/service';
import { fetchDatadel } from '@/service';
import { fetchDatadels } from '@/service';
import { fetchNull } from '@/service';
import { fetchFormat } from '@/service';
import { fetchFault } from '@/service';
import { abvCandidate } from '@/service';
import { stateCandidate } from '@/service';
import { cityCandidate } from '@/service';
import { completeCandidate } from '@/service';
import { autorepair } from '@/service';
import { useBoolean, useLoading } from '@/hooks';
import { localStg } from '~/src/utils';
import TableActionModal from './components/table-action-modal.vue';
import type { ModalType } from './components/table-action-modal.vue';
// eslint-disable-next-line import/no-unresolved
// import ColumnSetting from './components/column-setting.vue';
const showSpin = ref(false);
const { loading, startLoading, endLoading } = useLoading(false);
const { bool: visible, setTrue: openModal } = useBoolean();
const checkedRowKeyRef = ref([]);
const currentId = ref('');
const deleteFlag = ref(false);
const value = ref('请选择错误类型');
const options = ref([]);
const options_edit1 = ref([]);
const options_edit2 = ref([]);
const options_edit3 = ref([]);
const valueSelect1 = ref('');
const valueSelect2 = ref('');
const valueSelect3 = ref('');
const tableData = ref<UserManagement.Data[]>([]);
const showModal = ref(false);
options.value = [
  {
    label: '缺失值',
    value: 'missingWrong'
  },
  {
    label: '格式错误',
    value: 'formatWrong'
  },
  {
    label: '不一致',
    value: 'consistenceWrong'
  }
];

function setTableData(data: UserManagement.Data[]) {
  tableData.value = data;
}
async function handleClick(select1: string | null, select2: string | null, select3: string | null) {
  const findItem = tableData.value.find(item => item.index === currentId.value);
  if (select1 !== '') {
    findItem.abv = select1;
  }
  if (select2 !== '') {
    findItem.state = select2;
  }
  if (select3 !== '') {
    findItem.city = select3;
  }
  const { data } = completeCandidate(findItem); // 手动清洗
  if (data.userName == localStg.get('userName')) {
    window.$message?.success('修改成功');
    showModal.value = false;
  }
}
async function handleUpdateValue() {
  startLoading();
  if (value.value === 'missingWrong') {
    const { data } = await fetchNull();
    tableData.value = data;
  } else if (value.value === 'formatWrong') {
    const { data } = await fetchFormat();
    tableData.value = data;
  } else {
    const { data } = await fetchFault();
    tableData.value = data;
  }
  endLoading();
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
          <NButton size={'small'} onClick={() => handleEditTable(row.index)}>
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

async function handleEditTable(rowId: string) {
  const findItem = tableData.value.find(item => item.id === rowId);
  if (findItem) {
    setEditData(findItem);
  }
  currentId.value = rowId;
  showModal.value = true;
  showSpin.value = true;
  const data1 = await abvCandidate(rowId);
  const data2 = await stateCandidate(rowId);
  const data3 = await cityCandidate(rowId);

  options_edit1.value = data1.data.map(item => {
    return {
      label: item,
      value: item
    };
  });
  options_edit2.value = data2.data.map(item => {
    return {
      label: item,
      value: item
    };
  });
  options_edit3.value = data3.data.map(item => {
    return {
      label: item,
      value: item
    };
  });
  showSpin.value = false;
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
}

// 初始化
init();
</script>

<style scoped></style>
