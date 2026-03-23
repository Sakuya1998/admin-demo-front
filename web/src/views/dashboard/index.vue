<template>
  <div class="dashboard-container">
    <a-row :gutter="[16, 16]">
      <a-col :span="6" v-for="(metric, index) in metrics" :key="index">
        <a-card class="metric-card">
          <div class="metric-title">{{ t(metric.title) }}</div>
          <div class="metric-value" :style="{ color: metric.color }">{{ metric.value }}</div>
          <a-progress 
            :percent="metric.percent" 
            :stroke-color="metric.color" 
            :show-info="false" 
            size="small" 
            class="metric-progress"
          />
          <div class="metric-footer">
            <span>{{ t('dashboard.trend') }}: {{ metric.trend }}</span>
            <span>{{ t(metric.status) }}</span>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- Charts Section -->
    <a-row :gutter="[16, 16]" style="margin-top: 16px">
      <a-col :span="16">
        <a-card :title="t('dashboard.traffic')" class="chart-card">
          <Chart :options="lineChartOptions" height="300px" />
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card :title="t('dashboard.distribution')" class="chart-card">
          <Chart :options="pieChartOptions" height="300px" />
        </a-card>
      </a-col>
    </a-row>
    
    <a-row :gutter="[16, 16]" style="margin-top: 16px">
      <a-col :span="16">
        <a-card :title="t('dashboard.logs')" class="log-card">
          <a-timeline mode="left">
            <a-timeline-item color="green">{{ t('dashboard.timeline.init') }}</a-timeline-item>
            <a-timeline-item color="green">{{ t('dashboard.timeline.network') }}</a-timeline-item>
            <a-timeline-item color="blue">{{ t('dashboard.timeline.auth') }}</a-timeline-item>
            <a-timeline-item color="red">{{ t('dashboard.timeline.alert') }}</a-timeline-item>
            <a-timeline-item color="blue">{{ t('dashboard.timeline.sync') }}</a-timeline-item>
          </a-timeline>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card :title="t('dashboard.resources')" class="resource-card">
          <div class="resource-item">
            <span>{{ t('system.status.cpu') }} CORE 01</span>
            <a-progress :percent="85" stroke-color="#FF003C" />
          </div>
          <div class="resource-item">
            <span>{{ t('system.status.cpu') }} CORE 02</span>
            <a-progress :percent="42" stroke-color="#00F0FF" />
          </div>
          <div class="resource-item">
            <span>{{ t('system.status.mem') }}</span>
            <a-progress :percent="60" stroke-color="#7000FF" />
          </div>
          <div class="resource-item">
            <span>{{ t('dashboard.storage') }}</span>
            <a-progress :percent="25" stroke-color="#00FF9D" />
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import Chart from '@/components/Chart.vue';

const { t } = useI18n();

const metrics = computed(() => [
  { title: 'system.userMgmt', value: '8,492', percent: 75, color: '#00F0FF', trend: '+12%', status: 'system.status.optimal' },
  { title: 'system.dashboard', value: '1,204', percent: 45, color: '#00FF9D', trend: '+5%', status: 'system.status.stable' },
  { title: 'system.status.high', value: '82%', percent: 82, color: '#FFD600', trend: '+2%', status: 'system.status.high' },
  { title: 'system.status.critical', value: '3', percent: 15, color: '#FF003C', trend: '-1', status: 'system.status.critical' },
]);

const lineChartOptions = reactive({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'cross' }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    axisLine: { lineStyle: { color: '#888' } }
  },
  yAxis: {
    type: 'value',
    axisLine: { lineStyle: { color: '#888' } },
    splitLine: { lineStyle: { color: '#333', type: 'dashed' } }
  },
  series: [
    {
      name: 'Traffic',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: { width: 3, color: '#00F0FF' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: 'rgba(0, 240, 255, 0.5)' }, { offset: 1, color: 'rgba(0, 240, 255, 0)' }]
        }
      },
      emphasis: { focus: 'series' },
      data: [120, 132, 101, 134, 90, 230, 210]
    },
    {
      name: 'Sessions',
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: { width: 3, color: '#7000FF' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: 'rgba(112, 0, 255, 0.5)' }, { offset: 1, color: 'rgba(112, 0, 255, 0)' }]
        }
      },
      emphasis: { focus: 'series' },
      data: [220, 182, 191, 234, 290, 330, 310]
    }
  ]
});

const pieChartOptions = reactive({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center',
    textStyle: { color: '#888' }
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 0,
        borderColor: '#000',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '20',
          fontWeight: 'bold',
          color: '#fff'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1048, name: 'Search Engine', itemStyle: { color: '#00F0FF' } },
        { value: 735, name: 'Direct', itemStyle: { color: '#7000FF' } },
        { value: 580, name: 'Email', itemStyle: { color: '#00FF9D' } },
        { value: 484, name: 'Union Ads', itemStyle: { color: '#FFD600' } },
        { value: 300, name: 'Video Ads', itemStyle: { color: '#FF003C' } }
      ]
    }
  ]
});
</script>

<style lang="less" scoped>
.metric-card {
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  .metric-title {
    font-size: 12px;
    color: var(--color-text-secondary);
    letter-spacing: 1px;
  }
  
  .metric-value {
    font-size: 36px;
    font-family: var(--font-family-mono);
    font-weight: bold;
    text-shadow: 0 0 10px currentColor;
  }
  
  .metric-footer {
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: var(--color-text-secondary);
    margin-top: 10px;
  }
}

.log-card, .resource-card {
  height: 400px;
  overflow-y: auto;
}

.resource-item {
  margin-bottom: 20px;
  
  span {
    display: block;
    margin-bottom: 5px;
    font-size: 12px;
    color: var(--color-text-secondary);
  }
}
</style>
