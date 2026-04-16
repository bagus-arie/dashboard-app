<template>
  <div class="halaman-utama">
    
    <div v-if="isLoading || dataAlat.length === 0" class="flex justify-center items-center min-h-screen">
      <LoadingCard />
    </div>

    <div v-else class="dashboard-page p-4">
      <!-- <div v-if="dataAlat" class="bg-black text-green-400 p-4 rounded mt-4 overflow-auto max-h-64 text-xs font-mono">
        <pre>{{ dataAlat }}</pre>
      </div> -->
      <div class="page-header mb-6">
        <h1 class="page-title">
          <span class="gradient-text">Dashboard Monitoring</span>
        </h1>
        <p class="page-subtitle">Pemeliharaan Instalasi Rumah Sakit</p>
      </div>

      <div class="mb-8">
        <div class="section-label mb-3">
          <v-icon size="16" color="primary" class="mr-1">mdi-chart-box</v-icon>
          Ringkasan Keseluruhan
        </div>
        
        <div class="mb-8">
          <StatisticCard/>
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
        <v-col
          v-for="building in buildings"
          :key="building.id"
          cols="12"
          md="6"
          lg="4"
        >
          <v-card class="building-card glass-card" variant="flat" rounded="xl">
            <v-card-text class="pa-5">
              <div class="d-flex align-center mb-4">
                <div class="building-icon-wrapper mr-3">
                  <v-icon size="26" color="primary">{{ building.icon }}</v-icon>
                </div>
                <div>
                  <h2 class="building-name">{{ building.name }}</h2>
                  <div class="building-meta">
                    {{ getSummary(building.id).activeFloors }} lantai aktif •
                    {{ getSummary(building.id).totalInstallations }} instalasi
                  </div>
                </div>
              </div>

              <div class="building-content">
                <div class="building-tower-wrapper">
                  <BuildingTower
                    :building="building"
                    @select-floor="navigateToFloor"
                  />
                </div>

                <div class="building-info">
                  <div class="info-item">
                    <div class="info-icon" style="background: rgba(108, 99, 255, 0.15)">
                      <v-icon size="18" color="#6C63FF">mdi-calendar-today</v-icon>
                    </div>
                    <div>
                      <div class="info-value">{{ getSummary(building.id).totalDaily }}</div>
                      <div class="info-label">Harian</div>
                    </div>
                  </div>

                  <div class="info-item">
                    <div class="info-icon" style="background: rgba(62, 201, 167, 0.15)">
                      <v-icon size="18" color="#3EC9A7">mdi-calendar-month</v-icon>
                    </div>
                    <div>
                      <div class="info-value">{{ getSummary(building.id).totalMonthly }}</div>
                      <div class="info-label">Bulanan</div>
                    </div>
                  </div>

                  <div class="info-item">
                    <div class="info-icon" style="background: rgba(66, 165, 245, 0.15)">
                      <v-icon size="18" color="#42A5F5">mdi-wrench-clock</v-icon>
                    </div>
                    <div>
                      <div class="info-value">{{ formatDate(getSummary(building.id).lastMaintenance) }}</div>
                      <div class="info-label">Pemeliharaan Terakhir</div>
                    </div>
                  </div>

                  <div class="info-item">
                    <div class="info-icon" style="background: rgba(251, 140, 0, 0.15)">
                      <v-icon size="18" color="#FB8C00">mdi-swap-horizontal-circle</v-icon>
                    </div>
                    <div>
                      <div class="info-value">{{ formatDate(getSummary(building.id).lastReplacement) }}</div>
                      <div class="info-label">Penggantian Terakhir</div>
                    </div>
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

<!-- <script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { ApiResponse } from '~/types/format';
const router = useRouter()
const { getBuildings, getBuildingSummary, formatDate } = useBuildings()

const buildings = computed(() => getBuildings())

const alatStore = useAlatStore()
const { dataAlat, isLoading, error, jumlahData } = storeToRefs(alatStore)

onMounted(() => {
  // Hanya panggil API jika data masih kosong (opsional, untuk mencegah pemanggilan berulang)
  // if (dataAlat.value.length === 0) {
    alatStore.fetchSemuaAlat()
  // }
})

const summaryCache = new Map()
function getSummary(buildingId: string) {
  if (!summaryCache.has(buildingId)) {
    summaryCache.set(buildingId, getBuildingSummary(buildingId))
  }
  return summaryCache.get(buildingId)
}

const globalSummary = computed(() => {
  let totalDaily = 0
  let totalMonthly = 0
  let lastMaintenance = ''
  let lastReplacement = ''

  buildings.value.forEach((b) => {
    const s = getSummary(b.id)
    totalDaily += s.totalDaily
    totalMonthly += s.totalMonthly
    if (s.lastMaintenance > lastMaintenance) lastMaintenance = s.lastMaintenance
    if (s.lastReplacement > lastReplacement) lastReplacement = s.lastReplacement
  })

  return { totalDaily, totalMonthly, lastMaintenance, lastReplacement }
})

function navigateToFloor(buildingId: string, floorId: number) {
  router.push(`/gedung/${buildingId}/lantai/${floorId}`)
}
</script> -->

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAlatStore } from '~/stores/alatStore'
import type { ApiResponse } from '~/types/format'

const router = useRouter()
// Tetap gunakan useBuildings untuk mengambil daftar master gedung (nama & icon), tapi format datanya kita kerjakan manual
const { getBuildings, formatDate } = useBuildings() 

const buildings = computed(() => getBuildings())

const alatStore = useAlatStore()
const { dataAlat, isLoading, error, jumlahData } = storeToRefs(alatStore)

onMounted(() => {
  alatStore.fetchSemuaAlat()
})

// --- HELPER UNTUK TANGGAL ---
const now = new Date()

// Ambil 10 karakter pertama, menghasilkan "YYYY-MM-DD"
const todayStr = now.toISOString().substring(0, 10) 

// Ambil 7 karakter pertama, menghasilkan "YYYY-MM"
const currentMonthStr = now.toISOString().substring(0, 7) 

function parseDate(dateString: string) {
  if (!dateString) return new Date(0)
  return new Date(dateString)
}

// Ini akan otomatis menghitung ulang setiap kali API selesai ditarik
const buildingSummaries = computed(() => {
  const summaries: Record<string, any> = {}

  buildings.value.forEach(b => {
    summaries[b.id] = {
      totalDaily: 0,
      totalMonthly: 0,
      totalInstallations: 0,
      activeFloors: 1, 
      lastMaintenance: '',
      lastReplacement: ''
    }
  })

  // Olah data asli dari API
  dataAlat.value.forEach((item: AlatData) => {
    const itemDate = parseDate(item.Timestamp)
    // Cek apakah tanggal di data mengandung "YYYY-MM-DD" hari ini
    const isToday = item.Timestamp && item.Timestamp.includes(todayStr??"")
    // Cek apakah tanggal di data mengandung "YYYY-MM" bulan ini
    const isThisMonth = item.Timestamp && item.Timestamp.includes(currentMonthStr)
    
    const jenisPekerjaan = (item['Jenis Pekerjaan'] || '').toLowerCase()
    const lokasiAlat = (item['Lokasi Alat'] || '').toLowerCase()

    // Membandingkan nama gedung (misal: "IGD") dengan data di Spreadsheet (misal: "Lantai 1 - IGD")
    const targetBuilding = buildings.value.find(b => 
      lokasiAlat.includes(b.name.toLowerCase()) || lokasiAlat.includes(b.id.toLowerCase())
    )

    if (targetBuilding) {
      const stats = summaries[targetBuilding.id]
      stats.totalInstallations++ // Menghitung berapa kali ada pengerjaan di gedung ini

      if (isToday) stats.totalDaily++
      if (isThisMonth) stats.totalMonthly++

      // Mencari tanggal Pemeliharaan paling baru
      if (jenisPekerjaan.includes('pemeliharaan') || jenisPekerjaan.includes('perbaikan')) {
        if (!stats.lastMaintenance || itemDate > new Date(stats.lastMaintenance)) {
          stats.lastMaintenance = item.Timestamp
        }
      }

      // Mencari tanggal Penggantian paling baru
      if (jenisPekerjaan.includes('ganti') || jenisPekerjaan.includes('penggantian')) {
        if (!stats.lastReplacement || itemDate > new Date(stats.lastReplacement)) {
          stats.lastReplacement = item.Timestamp
        }
      }
    }
  })

  return summaries
})

// Fungsi ini dipanggil di template HTML untuk menampilkan data per gedung (menggantikan cache lama)
function getSummary(buildingId: string) {
  return buildingSummaries.value[buildingId] || {
    totalDaily: 0, totalMonthly: 0, totalInstallations: 0, activeFloors: 0, lastMaintenance: '', lastReplacement: ''
  }
}

// --- LOGIKA RINGKASAN GLOBAL (PALING ATAS) ---
const globalSummary = computed(() => {
  let totalDaily = 0
  let totalMonthly = 0
  let lastMaintenance = ''
  let lastReplacement = ''

  dataAlat.value.forEach((item: AlatData) => {
    const itemDate = parseDate(item.Timestamp)
    const isToday = item.Timestamp && item.Timestamp.includes(todayStr??"")
    const isThisMonth = item.Timestamp && item.Timestamp.includes(currentMonthStr)
    const jenisPekerjaan = (item['Jenis Pekerjaan'] || '').toLowerCase()

    if (isToday) totalDaily++
    if (isThisMonth) totalMonthly++

    if (jenisPekerjaan.includes('pemeliharaan') || jenisPekerjaan.includes('perbaikan')) {
      if (!lastMaintenance || itemDate > new Date(lastMaintenance)) lastMaintenance = item.Timestamp
    }

    if (jenisPekerjaan.includes('ganti') || jenisPekerjaan.includes('penggantian')) {
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
