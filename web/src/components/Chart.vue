<template>
  <div ref="chartRef" :style="{ width: width, height: height }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import * as echarts from 'echarts';
import { useThemeStore } from '@/stores/theme';

const props = defineProps({
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '300px',
  },
  options: {
    type: Object,
    required: true,
  },
});

const chartRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;
const themeStore = useThemeStore();

const initChart = () => {
  if (!chartRef.value) return;
  
  // Dispose existing instance if any (for theme switch)
  if (chartInstance) {
    chartInstance.dispose();
  }

  // Use 'dark' theme for echarts if our app is in dark mode
  const theme = themeStore.theme === 'dark' ? 'dark' : undefined;
  
  chartInstance = echarts.init(chartRef.value, theme, {
    renderer: 'canvas',
  });
  
  setOptions();
  
  window.addEventListener('resize', resizeHandler);
};

const setOptions = () => {
  if (!chartInstance) return;
  
  // Merge base options with Cyber style overrides if needed
  const baseOptions = {
    backgroundColor: 'transparent',
    ...props.options
  };
  
  chartInstance.setOption(baseOptions);
};

const resizeHandler = () => {
  chartInstance?.resize();
};

watch(
  () => props.options,
  () => {
    setOptions();
  },
  { deep: true }
);

watch(
  () => themeStore.theme,
  () => {
    // Re-init chart on theme change to apply correct echarts theme
    nextTick(() => {
      initChart();
    });
  }
);

onMounted(() => {
  initChart();
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeHandler);
  chartInstance?.dispose();
});
</script>
