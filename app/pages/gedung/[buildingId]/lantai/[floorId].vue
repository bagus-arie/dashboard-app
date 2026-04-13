<template>
  <div class="floor-page">
    <!-- Back Button -->
    <div class="mb-4">
      <v-btn
        variant="text"
        color="primary"
        prepend-icon="mdi-arrow-left"
        @click="router.push('/')"
        size="small"
      >
        Kembali ke Dashboard
      </v-btn>
    </div>

    <!-- Error State -->
    <v-alert v-if="!floor || !building" type="error" variant="tonal" class="mb-4">
      Data lantai tidak ditemukan.
    </v-alert>

    <template v-if="floor && building">
      <!-- Floor Summary -->
      <div class="mb-6">
        <div class="section-label mb-3">
          <v-icon size="16" color="primary" class="mr-1">mdi-chart-box</v-icon>
          Ringkasan Lantai {{ floorId }}
        </div>
        <SummaryCards
          :daily-count="floorSummary.totalDaily"
          :monthly-count="floorSummary.totalMonthly"
          :last-maintenance="floorSummary.lastMaintenance"
          :last-replacement="floorSummary.lastReplacement"
        />
      </div>

      <!-- Floor Plan -->
      <v-card class="glass-card mb-6" variant="flat" rounded="xl">
        <v-card-text class="pa-5">
          <div class="section-label mb-4">
            <v-icon size="16" color="primary" class="mr-1">mdi-floor-plan</v-icon>
            Denah Instalasi
          </div>
          <FloorPlan
            :rooms="floor.rooms"
            :building-name="building.name"
            :floor-id="floorId"
            @select-installation="openDetail"
          />
        </v-card-text>
      </v-card>

      <!-- Installation List Table -->
      <v-card class="glass-card" variant="flat" rounded="xl">
        <v-card-text class="pa-5">
          <div class="section-label mb-4">
            <v-icon size="16" color="primary" class="mr-1">mdi-format-list-bulleted</v-icon>
            Daftar Instalasi ({{ allInstallations.length }})
          </div>

          <v-table density="comfortable" hover class="installation-table">
            <thead>
              <tr>
                <th>Instalasi</th>
                <th>Tipe</th>
                <th>Ruangan</th>
                <th>Status</th>
                <th>Pemeliharaan Terakhir</th>
                <th>Penggantian Terakhir</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in installationList"
                :key="item.installation.id"
                class="cursor-pointer"
                @click="openDetail(item.installation)"
              >
                <td>
                  <div class="d-flex align-center ga-2">
                    <v-icon size="18" :color="getTypeColor(item.installation.type)">
                      {{ getTypeIcon(item.installation.type) }}
                    </v-icon>
                    <span class="font-weight-medium">{{ item.installation.name }}</span>
                  </div>
                </td>
                <td>
                  <v-chip
                    size="x-small"
                    :color="getTypeColor(item.installation.type)"
                    variant="tonal"
                  >
                    {{ item.installation.type }}
                  </v-chip>
                </td>
                <td>{{ item.roomName }}</td>
                <td>
                  <div class="d-flex align-center ga-2">
                    <span
                      class="status-dot"
                      :class="'status-dot--' + item.installation.status"
                    ></span>
                    <span :style="{ color: getStatusColor(item.installation.status) }">
                      {{ getStatusLabel(item.installation.status) }}
                    </span>
                  </div>
                </td>
                <td>{{ formatDate(item.installation.lastMaintenance) }}</td>
                <td>{{ formatDate(item.installation.lastReplacement || '-') }}</td>
                <td>
                  <v-btn
                    icon
                    variant="text"
                    size="x-small"
                    color="primary"
                    @click.stop="openDetail(item.installation)"
                  >
                    <v-icon size="18">mdi-eye</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </template>

    <!-- Installation Detail Dialog -->
    <InstallationDetail
      v-if="selectedInstallation"
      v-model="showDetail"
      :installation="selectedInstallation"
    />
  </div>
</template>

<script setup lang="ts">
import type { Installation } from '~/composables/useBuildings'

const route = useRoute()
const router = useRouter()
const {
  getBuildingById,
  getFloor,
  getFloorSummary,
  getTypeColor,
  getTypeIcon,
  getStatusColor,
  getStatusLabel,
  formatDate,
} = useBuildings()

const buildingId = computed(() => route.params.buildingId as string)
const floorId = computed(() => parseInt(route.params.floorId as string))

const building = computed(() => getBuildingById(buildingId.value))
const floor = computed(() => getFloor(buildingId.value, floorId.value))
const floorSummary = computed(() => getFloorSummary(buildingId.value, floorId.value))

const allInstallations = computed(() => {
  if (!floor.value) return []
  return floor.value.rooms.flatMap((r) => r.installations)
})

const installationList = computed(() => {
  if (!floor.value) return []
  return floor.value.rooms.flatMap((room) =>
    room.installations.map((inst) => ({
      installation: inst,
      roomName: room.name,
    }))
  )
})

// Detail Dialog
const showDetail = ref(false)
const selectedInstallation = ref<Installation | null>(null)

function openDetail(installation: Installation) {
  selectedInstallation.value = installation
  showDetail.value = true
}
</script>

<style scoped>
.section-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  display: flex;
  align-items: center;
}

.installation-table {
  border-radius: 12px;
  overflow: hidden;
}

.installation-table th {
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.5) !important;
}

.installation-table td {
  font-size: 0.82rem !important;
}

.installation-table tr:hover {
  background: rgba(108, 99, 255, 0.08) !important;
}
</style>
