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

      <div class="filter-panel rounded-2xl mb-8 p-5">
        <div class="filter-item">
          <label class="custom-label">Dari Tanggal</label>
          <input type="date" v-model="filterStartDate" class="custom-input rounded-xl p-3">
        </div>
        
        <div class="filter-item">
          <label class="custom-label">Sampai Tanggal</label>
          <input type="date" v-model="filterEndDate" class="custom-input rounded-xl p-3">
        </div>

        <div class="filter-item">
          <label class="custom-label">Mode Grafik</label>
          <div class="select-wrapper">
            <select v-model="chartMode" class="custom-input rounded-xl p-3 appearance-none">
              <option value="pekerjaan">📊 Statistik Pekerjaan (Periksa vs Pelihara)</option>
              <option value="alat">🛠️ Statistik Jenis Alat</option>
            </select>
            <v-icon class="select-icon" size="20" color="#8b98a9">mdi-chevron-down</v-icon>
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
          :last-replacement="globalSummary.lastReplacement"
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
  let totalDaily = 0, totalMonthly = 0, lastMaintenance = '', lastReplacement = ''

  filteredDataAlat.value.forEach((item: AlatData) => {
    const itemDate = parseDate(item.Timestamp)
    const isToday = item.Timestamp.includes(todayStr)
    const isThisMonth = item.Timestamp.includes(currentMonthStr)
    const jenisPekerjaan = (item['Jenis Pekerjaan'] || '').toLowerCase()

    if (isToday) totalDaily++
    if (isThisMonth) totalMonthly++

    if (jenisPekerjaan.includes('pemeriksaan')) {
      if (!lastMaintenance || itemDate > new Date(lastMaintenance)) lastMaintenance = item.Timestamp
    }
    if (jenisPekerjaan.includes('pemeliharaan') || jenisPekerjaan.includes('ganti')) {
      if (!lastReplacement || itemDate > new Date(lastReplacement)) lastReplacement = item.Timestamp
    }
  })

  return { totalDaily, totalMonthly, lastMaintenance, lastReplacement }
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

/* Efek Kaca (Glassmorphism) untuk kotak luar */
.filter-panel {
  /* Efek Glassmorphism Anda (Tetap sama) */
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  /* CSS Tata Letak Horizontal Murni */
  display: flex;
  gap: 20px;
  align-items: flex-end; /* Memastikan kotak sejajar di bawah (karena labelnya ada di atas) */
  width: 100%;
}

.filter-panel:hover {
  box-shadow: 0 10px 40px rgba(108, 99, 255, 0.15);
}

/* Memastikan setiap kotak punya lebar yang sama (flex: 1) */
.filter-item {
  flex: 1;
  width: 100%;
}

/* Desain Kotak Input & Select */
.custom-input {
  width: 100%;
  box-sizing: border-box;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  transition: all 0.3s ease;
  outline: none;
  
  /* TAMBAHKAN BARIS INI: Memberi tahu browser untuk pakai kalender mode gelap bawaan */
  color-scheme: dark; 
}

/* Animasi saat kursor berada di atas input (Hover) */
.custom-input:hover {
  border-color: rgba(108, 99, 255, 0.5);
  background: rgba(15, 23, 42, 0.8);
}

/* Animasi saat input diklik (Focus) */
.custom-input:focus {
  border-color: #6C63FF;
  box-shadow: 0 0 0 4px rgba(108, 99, 255, 0.15);
  background: rgba(0, 0, 0, 0.4);
}

/* PERBAIKAN: Hapus filter invert yang merusak klik, ganti dengan ini saja */
.custom-input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.custom-input[type="date"]::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
  transform: scale(1.1);
}
/* Trik untuk Select agar terlihat seragam */
.select-wrapper {
  position: relative;
}

/* Memposisikan ikon panah kustom */
.select-icon {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none; /* Agar klik tembus ke select */
  opacity: 0.7;
}

/* Warna latar belakang dropdown option (Hanya berlaku di beberapa browser) */
.custom-input option {
  background-color: #1e293b;
  color: white;
  padding: 10px;
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
