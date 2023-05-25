<template>
  <div>
    <n-grid :x-gap="16" :y-gap="16" :item-responsive="true">
      <n-grid-item span="0:24 640:24 1024:24">
        <n-card :bordered="false" class="rounded-16px shadow-sm">
          <div ref="pieRef" class="w-full h-360px"></div>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue';
import { NTag } from 'naive-ui';
import { ref, defineComponent,reactive } from 'vue';
import type { Ref } from 'vue';
import { onMounted } from 'vue';
import { number } from 'echarts';
import { setup } from 'mockjs';
import { type ECOption, useEcharts } from '@/composables';
import { useBoolean, useLoading } from '@/hooks';
import { fetchfaulttype } from '@/service';
const { loading, startLoading, endLoading } = useLoading(false);
defineOptions({ name: 'DashboardAnalysisTopCard' });

const pieOptions = ref<ECOption>({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    bottom: '1%',
    left: 'center',
    itemStyle: {
      borderWidth: 0
    }
  },
  series: [
    {
      color: ['#5da8ff', '#8e9dff', '#fedc69', '#26deca'],
      name: '错误类型',
      type: 'pie',
      radius: ['45%', '75%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 1
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '12'
        }
      },
      labelLine: {
        show: false
      },
      data: []
    }
  ]
}) as Ref<ECOption>;
const { domRef: pieRef } = useEcharts(pieOptions);

async function getCorrData() {
  startLoading();
  const { data } = await fetchfaulttype();
  echars(data);
}

function echars(data){
  const alldata = [
        { value: data[0], name: 'Null' },
        { value: data[1], name: 'Format' },
        { value: data[2], name: 'Fault' }
      ];

  pieOptions.value.series[0].data = alldata;
}

function init() {
  getCorrData();
}

// 初始化
onMounted(() => {
  init();
});
</script>

<style scoped></style>
