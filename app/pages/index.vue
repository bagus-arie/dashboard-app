<template>
  <div class="dashboard-page">
    <!-- Page Header -->
    <div class="page-header mb-6">
      <h1 class="page-title">
        <span class="gradient-text">Dashboard Monitoring</span>
      </h1>
      <p class="page-subtitle">Pemeliharaan Instalasi Rumah Sakit</p>
    </div>

    <!-- Global Summary -->
    <div class="mb-8">
      <div class="section-label mb-3">
        <v-icon size="16" color="primary" class="mr-1">mdi-chart-box</v-icon>
        Ringkasan Keseluruhan
      </div>
      <SummaryCards
        :daily-count="globalSummary.totalDaily"
        :monthly-count="globalSummary.totalMonthly"
        :last-maintenance="globalSummary.lastMaintenance"
        :last-replacement="globalSummary.lastReplacement"
      />
    </div>

    <!-- Buildings Grid -->
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
            <!-- Building Title -->
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

            <!-- Building Tower + Summary -->
            <div class="building-content">
              <!-- Tower -->
              <div class="building-tower-wrapper">
                <BuildingTower
                  :building="building"
                  @select-floor="navigateToFloor"
                />
              </div>

              <!-- Info -->
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
</template>

<script setup lang="ts">
const router = useRouter()
const { getBuildings, getBuildingSummary, formatDate } = useBuildings()

const buildings = computed(() => getBuildings())

// Cache summaries
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
