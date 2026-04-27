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
                <span
                  class="dialog-status"
                  :style="{ color: getStatusColor(installation.status) }"
                >
                  {{ getStatusLabel(installation.status) }}
                </span>
                <v-chip
                  size="x-small"
                  variant="outlined"
                  :color="getTypeColor(installation.type)"
                >
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

      <!-- Summary Stats / Parameter Terakhir -->
      <v-card-text class="pa-5">
        <!-- uncomment untuk liat debug -->
        <!-- <pre>{{ installation }}</pre> -->
        <template v-if="installation">
          <div class="section-label mb-3">
            <v-icon size="14" color="primary" class="mr-1">mdi-gauge</v-icon>
            Parameter Terakhir ( isi data di arus r)
          </div>
          <v-row dense class="mb-6">
            <v-col cols="6" sm="3">
              <div class="mini-stat">
                <div class="mini-stat-value">
                  {{ installation.data?.["Hour Meter"] || "-" }}
                </div>
                <div class="mini-stat-label">Hour Meter</div>
              </div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="mini-stat">
                <div class="mini-stat-value">
                  {{ installation.data?.["Pressure On"] || "-" }} /
                  {{ installation.data?.["Pressure Off"] || "-" }}
                </div>
                <div class="mini-stat-label">Pressure (On/Off)</div>
              </div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="mini-stat">
                <div class="mini-stat-value">
                  {{ installation.data?.["Arus R"] || "-" }} /
                  {{ installation.data?.["Arus S"] || "-" }} /
                  {{ installation.data?.["Arus T"] || "-" }}
                </div>
                <div class="mini-stat-label">Arus (R/S/T)</div>
              </div>
            </v-col>
            <v-col cols="6" sm="3">
              <div class="mini-stat">
                <div class="mini-stat-value">
                  {{ installation.data?.["Tegangan L-L (Avg)"] || "-" }} /
                  {{ installation.data?.["Tegangan L-N (Avg)"] || "-" }}
                </div>
                <div class="mini-stat-label">Tegangan (L-L / L-N)</div>
              </div>
            </v-col>
          </v-row>
        </template>

        <!-- Table Header -->
        <!-- <div class="d-flex align-center justify-space-between mb-3">
          <h4 class="table-title">Riwayat Pemeliharaan</h4>
          <v-chip size="small" color="primary" variant="tonal">
            {{ records.length }} record
          </v-chip>
        </div> -->

        <!-- Data Table -->
        <v-table density="comfortable" class="records-table" hover>
          <thead>
            <tr>
              <th>Nama Alat</th>
              <th>Tanggal</th>
              <th>Pekerjaan</th>
              <th>Detail</th>
              <th>Teknisi / Foto</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in installation.dataList">
              <td>{{ item["Jenis Alat"] ?? "-" }}</td>
              <td class="text-caption">
                {{ formatDate(item.Timestamp ?? "") }}
              </td>
              <td>
                <v-chip
                  size="x-small"
                  :color="
                    item['Jenis Pekerjaan'] === 'penggantian'
                      ? 'warning'
                      : 'primary'
                  "
                  variant="tonal"
                >
                  {{
                    item["Jenis Pekerjaan"] === "penggantian"
                      ? "Ganti Part"
                      : "Periksa"
                  }}
                </v-chip>
              </td>
              <td class="text-caption description-cell">
                {{
                  item[
                    "Jenis Pekerjaan (Jelaskan part yang diganti / Pekerjaan yang dilakukan)"
                  ] ?? "-"
                }}
              </td>
              <td>
                <div class="d-flex ga-1">
                  <v-btn
                    v-if="item['Foto Selfie + Time Stamp']"
                    :href="item['Foto Selfie + Time Stamp']"
                    target="_blank"
                    icon
                    size="x-small"
                    variant="text"
                    color="primary"
                    title="Foto Selfie"
                  >
                    <v-icon size="16">mdi-camera-account</v-icon>
                  </v-btn>
                  <v-btn
                    v-else
                    :href="item['Foto Selfie + Time Stamp']"
                    target="_blank"
                    icon
                    size="x-small"
                    variant="text"
                    color="primary"
                    title="Foto Selfie"
                  >
                    <v-icon size="16">mdi-camera-account</v-icon>
                  </v-btn>
                  <v-btn
                    v-if="item['Foto pekerjaan']"
                    :href="item['Foto pekerjaan']"
                    target="_blank"
                    icon
                    size="x-small"
                    variant="text"
                    color="success"
                    title="Foto Pekerjaan"
                  >
                    <v-icon size="16">mdi-camera</v-icon>
                  </v-btn>
                  <v-btn
                    v-else
                    :href="item['Foto Selfie + Time Stamp']"
                    target="_blank"
                    icon
                    size="x-small"
                    variant="text"
                    color="primary"
                    title="Foto Selfie"
                  >
                    <v-icon size="16">mdi-camera-account</v-icon>
                  </v-btn>
                </div>
              </td>
            </tr>
            <tr v-if="installation.data === null">
              <td colspan="4" class="text-center pa-4 text-grey">
                Belum ada riwayat untuk alat ini di lokasi ini.
              </td>
            </tr>
          </tbody>
        </v-table>

        <div class="mt-4 text-center">
          <v-alert
            type="info"
            variant="tonal"
            density="compact"
            class="text-caption"
          >
            <v-icon size="16" class="mr-1">mdi-information</v-icon>
            Data sinkron dengan Google Sheets (Real-time)
          </v-alert>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { Installation } from "~/composables/useBuildings";
import type { AlatData } from "~/types/format";

const props = defineProps<{
  installation: Installation;
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const {
  formatDate,
  getTypeColor,
  getTypeIcon,
  getStatusColor,
  getStatusLabel,
  getInstallationRecords,
} = useBuildings();

const dialogOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

// const records = computed(() => getInstallationRecords(props.installation.id))

function getResultColor(result: string): string {
  const map: Record<string, string> = {
    baik: "success",
    perbaikan: "warning",
    penggantian_part: "info",
  };
  return map[result] || "default";
}

function getResultLabel(result: string): string {
  const map: Record<string, string> = {
    baik: "Baik",
    perbaikan: "Perbaikan",
    penggantian_part: "Ganti Part",
  };
  return map[result] || result;
}
</script>

<style scoped>
.installation-dialog {
  background: rgb(var(--v-theme-surface)) !important;
}

.dialog-header {
  background: linear-gradient(
    135deg,
    rgba(108, 99, 255, 0.08),
    rgba(62, 201, 167, 0.05)
  );
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

.description-cell {
  min-width: 250px;
  max-width: 400px;
  white-space: pre-line;
  line-height: 1.4;
  padding-top: 12px !important;
  padding-bottom: 12px !important;
}

.section-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  display: flex;
  align-items: center;
}
</style>
