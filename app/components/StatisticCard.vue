<script lang="ts" setup>
import { useColorMode } from '#imports'

// HAPUS SEMUA IMPORT DARI @unovis/ts (Sudah tidak dibutuhkan)

defineOptions({
  tags: ['barcharts', 'multiplebars']
})

// Menerima data dan kategori dari Halaman Utama
const props = withDefaults(
  defineProps<{
    showTitle?: boolean
    data: any[]
    categories: any
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

// Mengatur label di sumbu X (Bawah) agar menampilkan tanggal
const xFormatter = (tick: number): string => {
  return `${props.data[tick]?.date || ''}`
}
</script>

<template>
  <div class="mx-auto w-full space-y-6 rounded-lg" :class="showTitle ? 'p-6' : ''">
    <div v-if="showTitle" class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-white">Grafik Monitoring</h3>
    </div>
    
   <BarChart
      :key="colorMode.value"
      :data="props.data"
      :height="height"
      :categories="props.categories"
      :x-formatter="xFormatter"
      :y-axis="Object.keys(props.categories)" 
    />
    </div>
</template>