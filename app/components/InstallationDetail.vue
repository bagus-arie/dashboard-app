<template>
  <v-dialog v-model="dialogOpen" max-width="700" scrollable>
    <v-card class="installation-dialog" rounded="xl">
      <!-- Header -->
      <v-card-title class="dialog-header pa-5">
        <div class="d-flex align-center justify-space-between w-100">
          <div class="d-flex align-center">
            <div
              class="dialog-icon-wrapper mr-3"
              :style="{ background: getTypeColor(installation.type) + '22' }"
            >
              <v-icon :color="getTypeColor(installation.type)" size="28">
                {{ getTypeIcon(installation.type) }}
              </v-icon>
            </div>
            <div>
              <h3 class="dialog-title">{{ installation.name }}</h3>
              <div class="d-flex align-center ga-2 mt-1">
                <span
                  class="status-dot"
                  :class="'status-dot--' + installation.status"
                ></span>
                <span class="dialog-status" :style="{ color: getStatusColor(installation.status) }">
                  {{ getStatusLabel(installation.status) }}
                </span>
                <v-chip size="x-small" variant="outlined" :color="getTypeColor(installation.type)">
                  {{ installation.type }}
                </v-chip>
              </div>
            </div>
          </div>
          <v-btn icon variant="text" size="small" @click="dialogOpen = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card-title>

      <v-divider />

      <!-- Summary Stats -->
      <v-card-text class="pa-5">
        <v-row dense class="mb-5">
          <v-col cols="6" sm="3">
            <div class="mini-stat">
              <div class="mini-stat-value">{{ installation.dailyCount }}</div>
              <div class="mini-stat-label">Harian</div>
            </div>
          </v-col>
          <v-col cols="6" sm="3">
            <div class="mini-stat">
              <div class="mini-stat-value">{{ installation.monthlyCount }}</div>
              <div class="mini-stat-label">Bulanan</div>
            </div>
          </v-col>
          <v-col cols="6" sm="3">
            <div class="mini-stat">
              <div class="mini-stat-value">{{ formatDate(installation.lastMaintenance) }}</div>
              <div class="mini-stat-label">Pemeliharaan</div>
            </div>
          </v-col>
          <v-col cols="6" sm="3">
            <div class="mini-stat">
              <div class="mini-stat-value">{{ formatDate(installation.lastReplacement || '-') }}</div>
              <div class="mini-stat-label">Penggantian</div>
            </div>
          </v-col>
        </v-row>

        <!-- Table Header -->
        <div class="d-flex align-center justify-space-between mb-3">
          <h4 class="table-title">Riwayat Pemeliharaan</h4>
          <v-chip size="small" color="primary" variant="tonal">
            {{ records.length }} record
          </v-chip>
        </div>

        <!-- Data Table -->
        <v-table density="comfortable" class="records-table" hover>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Jenis</th>
              <th>Deskripsi</th>
              <th>Teknisi</th>
              <th>Hasil</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in records" :key="record.id">
              <td>{{ formatDate(record.date) }}</td>
              <td>
                <v-chip
                  size="x-small"
                  :color="record.type === 'penggantian' ? 'warning' : 'primary'"
                  variant="tonal"
                >
                  {{ record.type === 'penggantian' ? 'Penggantian' : 'Pemeliharaan' }}
                </v-chip>
              </td>
              <td>{{ record.description }}</td>
              <td>{{ record.technician }}</td>
              <td>
                <v-chip
                  size="x-small"
                  :color="getResultColor(record.result)"
                  variant="tonal"
                >
                  {{ getResultLabel(record.result) }}
                </v-chip>
              </td>
            </tr>
          </tbody>
        </v-table>

        <div class="mt-4 text-center">
          <v-alert type="info" variant="tonal" density="compact" class="text-caption">
            <v-icon size="16" class="mr-1">mdi-information</v-icon>
            Data akan terhubung ke Google Sheets webservice
          </v-alert>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { Installation } from '~/composables/useBuildings'

const props = defineProps<{
  installation: Installation
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const { formatDate, getTypeColor, getTypeIcon, getStatusColor, getStatusLabel, getInstallationRecords } = useBuildings()

const dialogOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const records = computed(() => getInstallationRecords(props.installation.id))

function getResultColor(result: string): string {
  const map: Record<string, string> = {
    baik: 'success',
    perbaikan: 'warning',
    penggantian_part: 'info',
  }
  return map[result] || 'default'
}

function getResultLabel(result: string): string {
  const map: Record<string, string> = {
    baik: 'Baik',
    perbaikan: 'Perbaikan',
    penggantian_part: 'Ganti Part',
  }
  return map[result] || result
}
</script>

<style scoped>
.installation-dialog {
  background: rgb(var(--v-theme-surface)) !important;
}

.dialog-header {
  background: linear-gradient(135deg, rgba(108, 99, 255, 0.08), rgba(62, 201, 167, 0.05));
}

.dialog-icon-wrapper {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
}

.dialog-status {
  font-size: 0.8rem;
  font-weight: 600;
}

.w-100 {
  width: 100%;
}

.mini-stat {
  background: rgba(108, 99, 255, 0.08);
  border-radius: 12px;
  padding: 14px 12px;
  text-align: center;
  border: 1px solid rgba(108, 99, 255, 0.1);
}

.mini-stat-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
}

.mini-stat-label {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.45);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 4px;
}

.table-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.85);
}

.records-table {
  border-radius: 12px;
  overflow: hidden;
}

.records-table th {
  font-size: 0.75rem !important;
  font-weight: 700 !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.5) !important;
}

.records-table td {
  font-size: 0.82rem !important;
}
</style>
