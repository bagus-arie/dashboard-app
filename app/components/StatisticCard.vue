<script lang="ts" setup>
import { useColorMode } from '#imports'
// Hapus import BulletLegendItemInterface jika membuat error

defineOptions({
  tags: ['areacharts', 'multiplelines']
})

// 1. TAMBAHKAN PROPS CATEGORIES
const props = withDefaults(
  defineProps<{
    showTitle?: boolean
    data: any[]
    categories: any // Menerima konfigurasi warna & nama dari halaman utama
  }>(),
  {
    showTitle: false,
    data: () => [],
    categories: () => ({})
  }
)

const { height } = useResponsiveHeight({
  default: 200,
  sm: 300
})

const colorMode = useColorMode()

const xFormatter = (tick: number): string => {
  return `${props.data[tick]?.date || ''}`
}
</script>

<template>
  <div class="mx-auto w-full space-y-6 rounded-lg" :class="showTitle ? 'p-6' : ''">
    <div v-if="showTitle" class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-white">Grafik Monitoring</h3>
    </div>
    
    <AreaChart
      :key="colorMode.value"
      :data="props.data"
      :height="height"
      :categories="props.categories"
      :y-grid-line="true"
      :x-formatter="xFormatter"
      :curve-type="CurveType.MonotoneX"
      :legend-position="LegendPosition.TopRight"
      :hide-legend="false"
    />
  </div>
</template>