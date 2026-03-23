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
            <a-timeline-item color="var(--color-success)">{{ t('dashboard.timeline.init') }}</a-timeline-item>
            <a-timeline-item color="var(--color-success)">{{ t('dashboard.timeline.network') }}</a-timeline-item>
            <a-timeline-item color="var(--color-primary)">{{ t('dashboard.timeline.auth') }}</a-timeline-item>
            <a-timeline-item color="var(--color-error)">{{ t('dashboard.timeline.alert') }}</a-timeline-item>
            <a-timeline-item color="var(--color-primary)">{{ t('dashboard.timeline.sync') }}</a-timeline-item>
          </a-timeline>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card :title="t('dashboard.resources')" class="resource-card">
          <div class="resource-item">
            <span>{{ t('system.status.cpu') }} CORE 01</span>
            <a-progress :percent="85" stroke-color="var(--color-error)" />
          </div>
          <div class="resource-item">
            <span>{{ t('system.status.cpu') }} CORE 02</span>
            <a-progress :percent="42" stroke-color="var(--color-primary)" />
          </div>
          <div class="resource-item">
            <span>{{ t('system.status.mem') }}</span>
            <a-progress :percent="60" stroke-color="var(--color-secondary)" />
          </div>
          <div class="resource-item">
            <span>{{ t('dashboard.storage') }}</span>
            <a-progress :percent="25" stroke-color="var(--color-success)" />
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useThemeStore } from '@/stores/theme';
import Chart from '@/components/Chart.vue';

const { t } = useI18n();
const themeStore = useThemeStore();

const metrics = computed(() => [
  { title: 'system.userMgmt', value: '8,492', percent: 75, color: 'var(--color-primary)', trend: '+12%', status: 'system.status.optimal' },
  { title: 'system.dashboard', value: '1,204', percent: 45, color: 'var(--color-success)', trend: '+5%', status: 'system.status.stable' },
  { title: 'system.status.high', value: '82%', percent: 82, color: 'var(--color-warning)', trend: '+2%', status: 'system.status.high' },
  { title: 'system.status.critical', value: '3', percent: 15, color: 'var(--color-error)', trend: '-1', status: 'system.status.critical' },
]);

const chartColors = computed(() => {
  const currentTheme = themeStore.theme;
  return {
    primary: currentTheme === 'light' ? '#1677FF' : '#00F0FF',
    secondary: currentTheme === 'light' ? '#722ED1' : '#7000FF',
    success: currentTheme === 'light' ? '#52C41A' : '#00FF9D',
    warning: currentTheme === 'light' ? '#FAAD14' : '#FFD600',
    error: currentTheme === 'light' ? '#FF4D4F' : '#FF003C',
    grid: currentTheme === 'light' ? '#D9D9D9' : '#333',
    border: currentTheme === 'light' ? '#FFF' : '#000',
    text: currentTheme === 'light' ? '#666' : '#888',
    textHighlight: currentTheme === 'light' ? '#333' : '#fff',
    primaryAreaStart: currentTheme === 'light' ? 'rgba(22, 119, 255, 0.5)' : 'rgba(0, 240, 255, 0.5)',
    primaryAreaEnd: currentTheme === 'light' ? 'rgba(22, 119, 255, 0)' : 'rgba(0, 240, 255, 0)',
    secondaryAreaStart: currentTheme === 'light' ? 'rgba(114, 46, 209, 0.5)' : 'rgba(112, 0, 255, 0.5)',
    secondaryAreaEnd: currentTheme === 'light' ? 'rgba(114, 46, 209, 0)' : 'rgba(112, 0, 255, 0)'
  };
});

const lineChartOptions = computed(() => {
  const colors = chartColors.value;

  return {
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
      axisLine: { lineStyle: { color: colors.text } }
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: colors.text } },
      splitLine: { lineStyle: { color: colors.grid, type: 'dashed' } }
    },
    series: [
      {
        name: 'Traffic',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: { width: 3, color: colors.primary },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: colors.primaryAreaStart }, { offset: 1, color: colors.primaryAreaEnd }]
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
        lineStyle: { width: 3, color: colors.secondary },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: colors.secondaryAreaStart }, { offset: 1, color: colors.secondaryAreaEnd }]
          }
        },
        emphasis: { focus: 'series' },
        data: [220, 182, 191, 234, 290, 330, 310]
      }
    ]
  };
});

const pieChartOptions = computed(() => {
  const colors = chartColors.value;

  return {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center',
      textStyle: { color: colors.text }
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 0,
          borderColor: colors.border,
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
            color: colors.textHighlight
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: 'Search Engine', itemStyle: { color: colors.primary } },
          { value: 735, name: 'Direct', itemStyle: { color: colors.secondary } },
          { value: 580, name: 'Email', itemStyle: { color: colors.success } },
          { value: 484, name: 'Union Ads', itemStyle: { color: colors.warning } },
          { value: 300, name: 'Video Ads', itemStyle: { color: colors.error } }
        ]
      }
    ]
  };
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
    text-shadow: var(--shadow-glow-text);
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
