<template>
  <div class="halaman-utama">
    <div v-if="isLoading && dataAlat.length === 0" class="flex justify-center items-center min-h-screen">
      <LoadingCard />
    </div>

    <div v-else class="dashboard-page p-4">
      <div class="page-header mb-6">
        <h1 class="page-title"><span class="gradient-text">Dashboard Monitoring</span></h1>
        <p class="page-subtitle">Pemeliharaan Instalasi Rumah Sakit</p>
      </div>

      <!-- Filter Panel -->
      <div class="filter-panel rounded-2xl mb-8">
        <div class="filter-panel-body">
          <div class="filter-item">
            <label class="filter-label">
              <v-icon size="13" class="mr-1" color="#42A5F5">mdi-calendar-start</v-icon>
              Dari Tanggal
            </label>
            <input type="date" v-model="filterStartDate" class="filter-input rounded-xl">
          </div>

          <div class="filter-divider">
            <v-icon size="18" color="rgba(255,255,255,0.2)">mdi-arrow-right</v-icon>
          </div>

          <div class="filter-item">
            <label class="filter-label">
              <v-icon size="13" class="mr-1" color="#3EC9A7">mdi-calendar-end</v-icon>
              Sampai Tanggal
            </label>
            <input type="date" v-model="filterEndDate" class="filter-input rounded-xl">
          </div>

          <div class="filter-separator"></div>

          <div class="filter-item filter-item--chart">
            <label class="filter-label">
              <v-icon size="13" class="mr-1" color="#FB8C00">mdi-chart-bar</v-icon>
              Tampilan Statistik
            </label>
            <div class="chart-mode-toggle">
              <button 
                class="chart-mode-btn" 
                :class="{ active: chartMode === 'pekerjaan' }"
                @click="chartMode = 'pekerjaan'"
              >
                <v-icon size="14" class="mr-1">mdi-clipboard-check-outline</v-icon>
                Per Pekerjaan
              </button>
              <button 
                class="chart-mode-btn" 
                :class="{ active: chartMode === 'alat' }"
                @click="chartMode = 'alat'"
              >
                <v-icon size="14" class="mr-1">mdi-tools</v-icon>
                Per Alat
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <div class="section-label mb-3">
          <v-icon size="16" color="primary" class="mr-1">mdi-chart-box</v-icon>
          Ringkasan Keseluruhan
        </div>
        
        <div class="mb-8">
          <StatisticCard :data="chartData" :categories="chartCategories" />
        </div>
        
        <SummaryCards
          :daily-count="globalSummary.totalDaily"
          :monthly-count="globalSummary.totalMonthly"
          :last-maintenance="globalSummary.lastMaintenance"
          :last-maintenance-tool="globalSummary.lastMaintenanceTool"
          :last-replacement="globalSummary.lastReplacement"
          :last-replacement-tool="globalSummary.lastReplacementTool"
          :recent-maintenance="globalSummary.recentMaintenance"
          :recent-replacement="globalSummary.recentReplacement"
        />
      </div>

      <div class="section-label mb-3">
        <v-icon size="16" color="primary" class="mr-1">mdi-office-building</v-icon>
        Gedung
      </div>

      <v-row>
        <v-col v-for="building in buildings" :key="building.id" cols="12" md="6" lg="4">
          <v-card class="building-card glass-card" variant="flat" rounded="xl">
            <v-card-text class="pa-5">
              <div class="d-flex align-center mb-4">
                <div class="building-icon-wrapper mr-3"><v-icon size="26" color="primary">{{ building.icon }}</v-icon></div>
                <div>
                  <h2 class="building-name">{{ building.name }}</h2>
                  <div class="building-meta">{{ getSummary(building.id).activeFloors }} lantai aktif • {{ getSummary(building.id).totalInstallations }} instalasi</div>
                </div>
              </div>

              <div class="building-content">
                <div class="building-tower-wrapper">
                  <BuildingTower :building="building" @select-floor="navigateToFloor" />
                </div>
                <div class="building-info">
                  <div class="info-item">
                    <div class="info-icon" style="background: rgba(108, 99, 255, 0.15)"><v-icon size="18" color="#6C63FF">mdi-calendar-today</v-icon></div>
                    <div><div class="info-value">{{ getSummary(building.id).totalDaily }}</div><div class="info-label">Harian</div></div>
                  </div>
                  <div class="info-item">
                    <div class="info-icon" style="background: rgba(62, 201, 167, 0.15)"><v-icon size="18" color="#3EC9A7">mdi-calendar-month</v-icon></div>
                    <div><div class="info-value">{{ getSummary(building.id).totalMonthly }}</div><div class="info-label">Bulanan</div></div>
                  </div>
                  <div class="info-item">
                    <div class="info-icon" style="background: rgba(66, 165, 245, 0.15)"><v-icon size="18" color="#42A5F5">mdi-wrench-clock</v-icon></div>
                    <div><div class="info-value">{{ formatDate(getSummary(building.id).lastMaintenance) }}</div><div class="info-label">Pemeriksaan</div></div>
                  </div>
                  <div class="info-item">
                    <div class="info-icon" style="background: rgba(251, 140, 0, 0.15)"><v-icon size="18" color="#FB8C00">mdi-swap-horizontal-circle</v-icon></div>
                    <div><div class="info-value">{{ formatDate(getSummary(building.id).lastReplacement) }}</div><div class="info-label">Pemeliharaan</div></div>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAlatStore } from '~/stores/alatStore'
import type { AlatData } from '~/types/format'

const router = useRouter()
const { getBuildings, formatDate } = useBuildings() 

const buildings = computed(() => getBuildings())

const alatStore = useAlatStore()
const { dataAlat, isLoading } = storeToRefs(alatStore)

onMounted(() => {
  alatStore.fetchSemuaAlat()
})

// ==========================================
// STATE UNTUK FILTER TANGGAL DAN MODE
// ==========================================
const filterStartDate = ref('')
const filterEndDate = ref('')
const chartMode = ref('pekerjaan') // Bisa 'pekerjaan' atau 'alat'

// Daftar warna dinamis untuk mode "Statistik Alat"
const colorPalette = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316']

function parseDate(dateString: string) {
  if (!dateString) return new Date(0)
  return new Date(dateString)
}

const now = new Date()
const todayStr = now.toISOString().substring(0, 10) 
const currentMonthStr = now.toISOString().substring(0, 7) 

// ==========================================
// MASTER DATA YANG SUDAH DI-FILTER
// ==========================================
// Kita buat Computed baru untuk memotong data berdasarkan tanggal Mulai & Sampai
const filteredDataAlat = computed(() => {
  return dataAlat.value.filter((item: AlatData) => {
    if (!item.Timestamp) return false;
    const itemDateStr = item.Timestamp.substring(0, 10);
    
    // Cek apakah masuk dalam range tanggal (jika filter diisi)
    if (filterStartDate.value && itemDateStr < filterStartDate.value) return false;
    if (filterEndDate.value && itemDateStr > filterEndDate.value) return false;
    
    return true;
  })
})

// ==========================================
// LOGIKA GRAFIK (STATISTIC CARD)
// ==========================================

// 1. Membuat Kategori & Warna Secara Dinamis
const chartCategories = computed(() => {
  if (chartMode.value === 'pekerjaan') {
    return {
      pemeriksaan: { name: 'Pemeriksaan', color: '#3b82f6' },
      pemeliharaan: { name: 'Pemeliharaan / Ganti', color: '#22c55e' }
    }
  } else {
    // Mode Alat: Ambil nama-nama alat unik yang ada di data
    const uniqueTools = new Set<string>()
    filteredDataAlat.value.forEach((i: AlatData) => {
      uniqueTools.add(i['Jenis Alat'] ? i['Jenis Alat'].toLowerCase() : 'tidak diketahui')
    })

    const categories: Record<string, any> = {}
    let colorIdx = 0
    uniqueTools.forEach(toolName => {
      categories[toolName] = { 
        name: toolName.toUpperCase(), 
        color: colorPalette[colorIdx % colorPalette.length] 
      }
      colorIdx++
    })
    return categories
  }
})

// 2. Menghitung Angka untuk Sumbu X dan Y
const chartData = computed(() => {
  const grouped: Record<string, Record<string, number>> = {}

  filteredDataAlat.value.forEach((item: AlatData) => {
    const date = item.Timestamp.substring(0, 10)
    if (!grouped[date]) grouped[date] = {} // Inisialisasi wadah tanggal
    
    const statsForDate = grouped[date]

    if (chartMode.value === 'pekerjaan') {
      const jenis = (item['Jenis Pekerjaan'] || '').toLowerCase()
      if (statsForDate.pemeriksaan === undefined) statsForDate.pemeriksaan = 0
      if (statsForDate.pemeliharaan === undefined) statsForDate.pemeliharaan = 0

      if (jenis.includes('pemeriksaan')) statsForDate.pemeriksaan++
      else if (jenis.includes('pemeliharaan') || jenis.includes('ganti')) statsForDate.pemeliharaan++
    } 
    else {
      // Mode Alat
      const alat = (item['Jenis Alat'] || 'tidak diketahui').toLowerCase()
      if (statsForDate[alat] === undefined) statsForDate[alat] = 0
      statsForDate[alat]++
    }
  })

  // Format ke bentuk Array Object untuk dibaca oleh NuxtCharts
  return Object.keys(grouped).sort().map(date => {
    return { date, ...grouped[date] }
  })
})

// ==========================================
// DATA GEDUNG DAN GLOBAL MENGGUNAKAN DATA FILTERED
// ==========================================
const buildingSummaries = computed(() => {
  const summaries: Record<string, any> = {}

  buildings.value.forEach(b => {
    summaries[b.id] = { totalDaily: 0, totalMonthly: 0, totalInstallations: 0, activeFloors: 1, lastMaintenance: '', lastReplacement: '' }
  })

  // Perhatikan: Menggunakan filteredDataAlat, bukan dataAlat !
  filteredDataAlat.value.forEach((item: AlatData) => {
    const itemDate = parseDate(item.Timestamp)
    const isToday = item.Timestamp.includes(todayStr)
    const isThisMonth = item.Timestamp.includes(currentMonthStr)
    const jenisPekerjaan = (item['Jenis Pekerjaan'] || '').toLowerCase()
    const lokasiAlat = (item['Lokasi Alat'] || '').toLowerCase()

    const targetBuilding = buildings.value.find(b => lokasiAlat.includes(b.name.toLowerCase()) || lokasiAlat.includes(b.id.toLowerCase()))

    if (targetBuilding) {
      const stats = summaries[targetBuilding.id]
      stats.totalInstallations++ 
      if (isToday) stats.totalDaily++
      if (isThisMonth) stats.totalMonthly++

      if (jenisPekerjaan.includes('pemeriksaan')) {
        if (!stats.lastMaintenance || itemDate > new Date(stats.lastMaintenance)) stats.lastMaintenance = item.Timestamp
      }
      if (jenisPekerjaan.includes('pemeliharaan') || jenisPekerjaan.includes('ganti')) {
        if (!stats.lastReplacement || itemDate > new Date(stats.lastReplacement)) stats.lastReplacement = item.Timestamp
      }
    }
  })
  return summaries
})

function getSummary(buildingId: string) {
  return buildingSummaries.value[buildingId] || { totalDaily: 0, totalMonthly: 0, totalInstallations: 0, activeFloors: 0, lastMaintenance: '', lastReplacement: '' }
}

const globalSummary = computed(() => {
  let totalDaily = 0, totalMonthly = 0
  let lastMaintenance = '', lastMaintenanceTool = ''
  let lastReplacement = '', lastReplacementTool = ''
  
  const maintenanceLogs = filteredDataAlat.value
    .filter(i => (i["Jenis Pekerjaan"]?.toLowerCase() || '').includes('pemeriksaan'))
    .sort((a, b) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime())

  const replacementLogs = filteredDataAlat.value
    .filter(i => {
      const jenis = i["Jenis Pekerjaan"]?.toLowerCase() || ''
      return jenis.includes('pemeliharaan') || jenis.includes('ganti')
    })
    .sort((a, b) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime())

  // Gunakan optional chaining langsung pada akses array [0]
  const firstMaintenance = maintenanceLogs[0]
  if (firstMaintenance) {
    lastMaintenance = firstMaintenance.Timestamp
    lastMaintenanceTool = firstMaintenance["Jenis Alat"] || '-'
  }

  const firstReplacement = replacementLogs[0]
  if (firstReplacement) {
    lastReplacement = firstReplacement.Timestamp
    lastReplacementTool = firstReplacement["Jenis Alat"] || '-'
  }

  // Count daily/monthly
  filteredDataAlat.value.forEach((item: AlatData) => {
    if (item.Timestamp?.includes(todayStr)) totalDaily++
    if (item.Timestamp?.includes(currentMonthStr)) totalMonthly++
  })

  return { 
    totalDaily, 
    totalMonthly, 
    lastMaintenance, 
    lastMaintenanceTool,
    lastReplacement, 
    lastReplacementTool,
    recentMaintenance: maintenanceLogs.slice(0, 5),
    recentReplacement: replacementLogs.slice(0, 5)
  }
})

function navigateToFloor(buildingId: string, floorId: number) {
  router.push(`/gedung/${buildingId}/lantai/${floorId}`)
}
</script>

<style scoped>
.page-header {
  text-align: left;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.45);
  font-weight: 500;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  display: flex;
  align-items: center;
}

.building-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.building-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(108, 99, 255, 0.15);
}

.building-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(108, 99, 255, 0.2), rgba(62, 201, 167, 0.15));
  display: flex;
  align-items: center;
  justify-content: center;
}

.building-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
}

.building-meta {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.45);
  font-weight: 500;
}

.building-content {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.building-tower-wrapper {
  flex-shrink: 0;
}

.building-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-value {
  font-size: 0.9rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.1;
}

.info-label {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

/* =====================
   FILTER PANEL REDESIGN
   ===================== */
.filter-panel {
  background: rgba(20, 30, 48, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(108, 99, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255,255,255,0.05);
  transition: box-shadow 0.3s ease;
  overflow: hidden;
}

.filter-panel:hover {
  box-shadow: 0 12px 40px rgba(108, 99, 255, 0.12), inset 0 1px 0 rgba(255,255,255,0.07);
}

.filter-panel-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: rgba(108, 99, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.filter-panel-title {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  flex: 1;
}

.filter-range-badge {
  display: flex;
  align-items: center;
  background: rgba(108, 99, 255, 0.15);
  color: #a5b4fc;
  border: 1px solid rgba(108, 99, 255, 0.25);
  border-radius: 20px;
  padding: 3px 10px;
  font-size: 0.7rem;
  font-weight: 600;
  font-family: monospace;
}

.filter-range-badge--inactive {
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.08);
}

.filter-panel-body {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 16px 20px;
}

.filter-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-item--chart {
  flex: 1.4;
}

.filter-label {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
}

.filter-input {
  width: 100%;
  box-sizing: border-box;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.88rem;
  padding: 10px 14px;
  transition: all 0.25s ease;
  outline: none;
  color-scheme: dark;
}

.filter-input:hover {
  border-color: rgba(108, 99, 255, 0.4);
  background: rgba(15, 23, 42, 0.9);
}

.filter-input:focus {
  border-color: #6C63FF;
  box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.12);
  background: rgba(0, 0, 0, 0.45);
}

.filter-input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

.filter-input[type="date"]::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}

.filter-divider {
  padding: 0 8px;
  margin-top: 22px;
  flex-shrink: 0;
}

.filter-separator {
  width: 1px;
  height: 44px;
  background: rgba(255, 255, 255, 0.07);
  margin: 22px 20px 0;
  flex-shrink: 0;
}

.chart-mode-toggle {
  display: flex;
  gap: 6px;
}

.chart-mode-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 9px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.7);
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.chart-mode-btn:hover {
  border-color: rgba(251, 140, 0, 0.4);
  color: rgba(255, 255, 255, 0.8);
  background: rgba(251, 140, 0, 0.06);
}

.chart-mode-btn.active {
  background: rgba(251, 140, 0, 0.15);
  border-color: rgba(251, 140, 0, 0.5);
  color: #FB8C00;
  box-shadow: 0 0 12px rgba(251, 140, 0, 0.1);
}

/* Responsive */
@media (max-width: 600px) {
  .building-content {
    flex-direction: column;
    align-items: center;
  }

  .building-info {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
  }

  .info-item {
    flex: 1 1 45%;
  }

  .page-title {
    font-size: 1.3rem;
  }
}
</style>
