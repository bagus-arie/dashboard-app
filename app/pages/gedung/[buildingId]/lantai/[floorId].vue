<template>
  <div class="floor-page">
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

    <v-alert
      v-if="!floor || !building"
      type="error"
      variant="tonal"
      class="mb-4"
    >
      Data lantai tidak ditemukan.
    </v-alert>

    <template v-if="floor && building">
      <div class="mb-6">
        <div class="section-label mb-3">
          <v-icon size="16" color="primary" class="mr-1">mdi-chart-box</v-icon>
          Ringkasan Lantai {{ floorId }}
          <v-progress-circular
            v-if="isLoading"
            indeterminate
            color="primary"
            size="16"
            class="ml-2"
          ></v-progress-circular>
        </div>
        <SummaryCards
          :daily-count="dynamicSummary.dailyCount"
          :monthly-count="dynamicSummary.monthlyCount"
          :last-maintenance="dynamicSummary.lastMaintenance"
          :last-maintenance-tool="dynamicSummary.lastMaintenanceTool"
          :last-replacement="dynamicSummary.lastReplacement"
          :last-replacement-tool="dynamicSummary.lastReplacementTool"
          :recent-maintenance="dynamicSummary.recentMaintenance"
          :recent-replacement="dynamicSummary.recentReplacement"
        />
      </div>

      <v-card class="glass-card mb-6" variant="flat" rounded="xl">
        <v-card-text class="pa-5">
          <div class="section-label mb-4">
            <v-icon size="16" color="primary" class="mr-1"
              >mdi-floor-plan</v-icon
            >
            Denah Alat
          </div>
          <FloorPlan
            :rooms="dynamicRooms"
            :building-name="building.name"
            :floor-id="floorId"
            @select-installation="openDetail"
          />
        </v-card-text>
      </v-card>

      <v-card
        class="glass-card mb-6 border-warning"
        variant="outlined"
        rounded="xl"
      >
        <v-card-text class="pa-5">
          uncomment untuk liat debug
          <div class="section-label mb-2 text-warning">
            <v-icon size="16" color="warning" class="mr-1">mdi-bug</v-icon>
            Debug: Raw Data API
          </div>
          <pre class="debug-pre">{{ JSON.stringify(dataAlat, null, 2) }}</pre>
          <pre> {{ buildingName + nomorLantai }}</pre>
          <pre>{{ nomorLantai }}</pre>
        </v-card-text>
      </v-card>
      <v-card class="glass-card" variant="flat" rounded="xl">
        <v-card-text class="pa-5">
          <div class="section-label mb-4">
            <v-icon size="16" color="primary" class="mr-1"
              >mdi-format-list-bulleted</v-icon
            >
            Daftar Instalasi ({{ dynamicInstallationList.length }})
          </div>

          <v-table density="comfortable" hover class="installation-table">
            <thead>
              <tr>
                <th>Instalasi</th>
                <th>Tipe</th>
                <th>Ruangan</th>
                <th>Status</th>
                <th>Pemeriksaan Terakhir</th>
                <th>Pemeliharaan Terakhir</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in dynamicInstallationList"
                :key="item.installation.id"
                class="cursor-pointer"
                @click="openDetail(item.installation)"
              >
                <td>
                  <div class="d-flex align-center ga-2">
                    <v-icon
                      size="18"
                      :color="getTypeColor(item.installation.type)"
                    >
                      {{ getTypeIcon(item.installation.type) }}
                    </v-icon>
                    <span class="font-weight-medium">{{
                      item.installation.name
                    }}</span>
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
                    <span
                      :style="{
                        color: getStatusColor(item.installation.status),
                      }"
                    >
                      {{ getStatusLabel(item.installation.status) }}
                    </span>
                  </div>
                </td>
                <td>{{ formatDate(item.installation.lastMaintenance) }}</td>
                <td>
                  {{ formatDate(item.installation.lastReplacement || "-") }}
                </td>
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

    <InstallationDetail
      v-if="selectedInstallation"
      v-model="showDetail"
      :installation="selectedInstallation"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useDetailAlatStore } from "~/stores/detailAlatStore";
import type { AlatData } from "~/types/format";

const route = useRoute();
const router = useRouter();

const detailAlatStore = useDetailAlatStore();
const buildingName = computed(() => route.params.buildingId as string);
const nomorLantai = computed(() => route.params.floorId as string);
const { dataAlat, isLoading } = storeToRefs(detailAlatStore);

onMounted(() => {
  detailAlatStore.fetchSemuaAlat(buildingName.value, nomorLantai.value);
});

const {
  getBuildingById,
  getFloor,
  getTypeColor,
  getTypeIcon,
  getStatusColor,
  getStatusLabel,
  formatDate,
} = useBuildings();

const buildingId = computed(() => route.params.buildingId as string);
const floorId = computed(() => parseInt(route.params.floorId as string));

const building = computed(() => getBuildingById(buildingId.value));
const floor = computed(() => getFloor(buildingId.value, floorId.value));

// Kebutuhan format tanggal hari ini dan bulan ini
const now = new Date();
const todayStr = now.toISOString().substring(0, 10);
const currentMonthStr = now.toISOString().substring(0, 7);

// ==========================================
// 1. DATA DINAMIS UNTUK SUMMARY CARDS
// ==========================================
const dynamicSummary = computed(() => {
  let dailyCount = 0;
  let monthlyCount = 0;

  // Urutkan Log Pemeriksaan terbaru
  const maintenanceLogs = dataAlat.value
    .filter((i) =>
      (i["Jenis Pekerjaan"]?.toLowerCase() || "").includes("pemeriksaan"),
    )
    .sort(
      (a, b) =>
        new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime(),
    );

  // Urutkan Log Pemeliharaan/Ganti terbaru
  const replacementLogs = dataAlat.value
    .filter((i) => {
      const jenis = i["Jenis Pekerjaan"]?.toLowerCase() || "";
      return jenis.includes("pemeliharaan") || jenis.includes("ganti");
    })
    .sort(
      (a, b) =>
        new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime(),
    );

  // Hitung jumlah pekerjaan hari ini dan bulan ini
  dataAlat.value.forEach((item) => {
    if (item.Timestamp?.includes(todayStr)) dailyCount++;
    if (item.Timestamp?.includes(currentMonthStr)) monthlyCount++;
  });

  return {
    dailyCount,
    monthlyCount,
    lastMaintenance: maintenanceLogs[0]?.Timestamp || "",
    lastMaintenanceTool: maintenanceLogs[0]?.["Jenis Alat"] || "-",
    lastReplacement: replacementLogs[0]?.Timestamp || "",
    lastReplacementTool: replacementLogs[0]?.["Jenis Alat"] || "-",
    recentMaintenance: maintenanceLogs.slice(0, 5),
    recentReplacement: replacementLogs.slice(0, 5),
  };
});

// ==========================================
// 2. DATA DINAMIS UNTUK TABEL INSTALASI
// ==========================================
const dynamicInstallationList = computed(() => {
  const toolMap = new Map();

  // 1. KUNCI RAHASIA: Regex Anti-Bocor!
  // Kita hilangkan semua spasi dari nama gedung dan nomor lantai.
  // Contoh: building="IGD", floor="1" -> menjadi "igd1"
  const bId = (buildingName.value || "").toLowerCase().replace(/\s+/g, "");
  const fId = (nomorLantai.value || "").toString().replace(/\s+/g, "");

  // Kita buat aturan tegas: harus ada "igd1" dan tidak boleh diikuti angka lain (seperti igd10)
  const targetRegex = new RegExp(bId + fId + "(?![0-9])", "i");

  dataAlat.value.forEach((data) => {
    const lokasiMentah = data["Lokasi Alat"] || "Lokasi Tidak Diketahui";
    const rawName = data["Jenis Alat"] || "Alat Tanpa Nama";

    // Hilangkan semua spasi dari data API agar mudah dicocokkan
    const lokasiClean = lokasiMentah.toLowerCase().replace(/\s+/g, ""); // "igd7r1" atau "igd1"
    const namaClean = rawName.toLowerCase().replace(/\s+/g, ""); // "igd7r1kompresor..."

    // ----------------------------------------------------
    // 2. SATPAM GEDUNG & LANTAI (TES REGEX)
    // ----------------------------------------------------
    // Saat sistem mencari "igd1" di dalam "igd7r1", hasilnya pasti FALSE karena terhalang angka 7.
    // Saat sistem mencari "igd1" di dalam "igd1", hasilnya TRUE.
    const isMilikLantaiIni =
      targetRegex.test(lokasiClean) || targetRegex.test(namaClean);

    if (!isMilikLantaiIni) return; // Tendang data IGD 7 R1 ke luar angkasa!

    // ----------------------------------------------------
    // 3. Tentukan Tipe Alat
    // ----------------------------------------------------
    let jenis = "kompresor";
    const lowerNameRaw = rawName.toLowerCase();
    if (lowerNameRaw.includes("vakum") || lowerNameRaw.includes("vacuum"))
      jenis = "vakum";
    else if (lowerNameRaw.includes("dryer")) jenis = "dryer";

    // ----------------------------------------------------
    // 4. Bersihkan Nama Alat agar rapi di tabel
    // ----------------------------------------------------
    let namaAlat = rawName
      .replace(/igd\s*\d*\s*r\d*/gi, "")
      .replace(/igd\s*\d*/gi, "")
      .trim();
    namaAlat = namaAlat.replace(/kompressor/gi, "Kompresor");
    namaAlat = namaAlat.replace(/\b\w/g, (c) => c.toUpperCase());

    // ----------------------------------------------------
    // 5. Buat Kunci Pengelompokan Unik
    // ----------------------------------------------------
    const uniqueKey = `${namaAlat}-${lokasiMentah}`.toLowerCase();

    if (!toolMap.has(uniqueKey)) {
      toolMap.set(uniqueKey, {
        installation: {
          id: uniqueKey,
          name: namaAlat,
          type: jenis,
          status: "baik",
          lastMaintenance: "-",
          lastReplacement: "-",
          dataList: [],
          data: {} as any,
          _latestLog: null,
        },
        roomName: lokasiMentah,
        _rawLogs: [],
      });
    }

    toolMap.get(uniqueKey)._rawLogs.push(data);
  });

  // ----------------------------------------------------
  // 6. Proses, Urutkan, dan Masukkan Riwayat
  // ----------------------------------------------------
  return Array.from(toolMap.values()).map((item) => {
    const logs = item._rawLogs;

    const sortedLogs = [...logs].sort(
      (a: any, b: any) =>
        new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime(),
    );

    const pemeriksaan = sortedLogs.find((l: any) =>
      (l["Jenis Pekerjaan"]?.toLowerCase() || "").includes("pemeriksaan"),
    );
    const pemeliharaan = sortedLogs.find((l: any) => {
      const j = l["Jenis Pekerjaan"]?.toLowerCase() || "";
      return j.includes("pemeliharaan") || j.includes("ganti");
    });

    item.installation.lastMaintenance = pemeriksaan?.Timestamp || "-";
    item.installation.lastReplacement = pemeliharaan?.Timestamp || "-";

    if (sortedLogs[0]) {
      const pekerjaanTerbaru = (
        sortedLogs[0]["Jenis Pekerjaan"] || ""
      ).toLowerCase();

      if (
        pekerjaanTerbaru.includes("perbaikan") ||
        pekerjaanTerbaru.includes("rusak")
      ) {
        item.installation.status = "rusak";
      } else if (
        pekerjaanTerbaru.includes("pemeliharaan") ||
        pekerjaanTerbaru.includes("ganti")
      ) {
        item.installation.status = "perlu_perhatian";
      } else {
        item.installation.status = "baik";
      }

      item.installation.data = sortedLogs[0];
      item.installation._latestLog = sortedLogs[0];
    }

    item.installation.dataList = sortedLogs;
    delete item._rawLogs;

    return item;
  });
});

// ==========================================
// FUNGSI PEMBERSIH NAMA ALAT (VERSI MAPPING)
// ==========================================
function cleanToolName(rawName: string): string {
  if (!rawName) return "Alat Tanpa Nama";
  const nameLower = rawName.toLowerCase();

  // Daftar kata kunci awal alat berdasarkan mapping kamu
  // Tambahkan kata lain jika ke depannya ada alat jenis baru
  const keywords = ["kompressor", "kompresor", "kompress", "vakum", "vacuum"];

  for (const keyword of keywords) {
    const index = nameLower.indexOf(keyword);
    if (index !== -1) {
      return nameLower.substring(index).trim();
    }
  }

  // Fallback jika anehnya tidak ada kata vakum/kompresor
  return rawName.trim();
}

// ==========================================
// 3. DATA DINAMIS UNTUK DENAH (FLOOR PLAN)
// ==========================================
const dynamicRooms = computed(() => {
  if (!floor.value) return [];

  // ----------------------------------------------------
  // 1. KUNCI RAHASIA: Regex Anti-Bocor Gedung & Lantai
  // ----------------------------------------------------
  const bId = (buildingName.value || "").toLowerCase().replace(/\s+/g, "");
  const fId = (nomorLantai.value || "").toString().replace(/\s+/g, "");
  const targetRegex = new RegExp(bId + fId + "(?![0-9])", "i"); // Contoh: "igd1"

  // --- KAMUS PENERJEMAH ---
  const normalizeText = (text: string) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .replace(/\b1\b/g, "alfa")
      .replace(/\b2\b/g, "beta")
      .replace(/\b3\b/g, "charlie")
      .replace(/kompressor/g, "kompresor")
      .trim();
  };

  return floor.value.rooms.map((room) => {
    const updatedInstallations = room.installations.map((inst) => {
      const historyLog = dataAlat.value.filter((log) => {
        const apiLokasi = (log["Lokasi Alat"] || "").toLowerCase();
        const apiNama = (log["Jenis Alat"] || "").toLowerCase();

        // ----------------------------------------------------
        // 2. FILTER LANTAI / GEDUNG (Pake REGEX)
        // ----------------------------------------------------
        const apiLokasiClean = apiLokasi.replace(/\s+/g, "");
        const apiNamaClean = apiNama.replace(/\s+/g, "");

        // Pastikan alat benar-benar milik IGD 1, dan tendang IGD 7 R1!
        const isMilikLantaiIni =
          targetRegex.test(apiLokasiClean) || targetRegex.test(apiNamaClean);
        if (!isMilikLantaiIni) return false;

        // ----------------------------------------------------
        // 3. FILTER RUANGAN (SMART ROOM FILTER)
        // ----------------------------------------------------
        const roomNameLower = room.name.toLowerCase(); // cth: "r1"
        const apiMenyebutRuangan =
          apiLokasi.includes(roomNameLower) || apiNama.includes(roomNameLower);

        // Cek apakah teknisi menulis "r1", "r2" secara spesifik di API
        const adaKodeRuanganDiApi =
          apiLokasi.match(/r\d/) || apiNama.match(/r\d/);

        if (adaKodeRuanganDiApi) {
          // Jika teknisi menulis "R", harus cocok dengan ruangan kotak ini
          if (!apiMenyebutRuangan) return false;
        }
        // Jika teknisi hanya nulis "IGD 1", biarkan lolos untuk dicek namanya

        // ----------------------------------------------------
        // 4. FILTER NAMA ALAT
        // ----------------------------------------------------
        const uiNameNorm = normalizeText(inst.name);
        const apiNameNorm = normalizeText(apiNama);

        // Pastikan tipe dasarnya sama
        if (!apiNameNorm.includes(inst.type.toLowerCase())) return false;

        const kataKunci = uiNameNorm
          .replace(/kompresor|vakum|vacuum|dryer/g, "")
          .trim()
          .split(/\s+/)
          .filter((k) => k.length > 0);

        if (kataKunci.length === 0) return true;

        // Pastikan SEMUA kata kunci ("hitachi" & "alfa") ada di teks API
        return kataKunci.every((kata) => apiNameNorm.includes(kata));
      });

      // ----------------------------------------------------
      // 5. URUTKAN & TENTUKAN STATUS LAMPU
      // ----------------------------------------------------
      const sortedHistoryLog = historyLog.sort(
        (a, b) =>
          new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime(),
      );

      const pemeriksaan = sortedHistoryLog.find((l: any) =>
        (l["Jenis Pekerjaan"]?.toLowerCase() || "").includes("pemeriksaan"),
      );
      const pemeliharaan = sortedHistoryLog.find((l: any) => {
        const j = l["Jenis Pekerjaan"]?.toLowerCase() || "";
        return j.includes("pemeliharaan") || j.includes("ganti");
      });

      const latestLog = sortedHistoryLog[0];

      let currentStatus = inst.status;
      if (latestLog) {
        const pekerjaan = (latestLog["Jenis Pekerjaan"] || "").toLowerCase();
        if (pekerjaan.includes("perbaikan") || pekerjaan.includes("rusak")) {
          currentStatus = "rusak";
        } else if (
          pekerjaan.includes("pemeliharaan") ||
          pekerjaan.includes("ganti")
        ) {
          currentStatus = "perlu_perhatian";
        } else {
          currentStatus = "baik";
        }
      }

      return {
        ...inst,
        status: currentStatus,
        lastMaintenance: pemeriksaan?.Timestamp || "-",
        lastReplacement: pemeliharaan?.Timestamp || "-",
        dataList: sortedHistoryLog,
        data: (latestLog || {}) as any,
        _latestLog: latestLog || null,
      };
    });

    return {
      ...room,
      installations: updatedInstallations,
    };
  });
});

// Detail Dialog
const showDetail = ref(false);
const selectedInstallation = ref<Installation | null>(null);

function openDetail(installation: Installation) {
  console.log("installation open detail");
  console.log(installation);
  selectedInstallation.value = installation;
  showDetail.value = true;
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
