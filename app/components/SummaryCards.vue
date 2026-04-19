<template>
  <v-row dense>
    <v-col v-for="card in cards" :key="card.label" cols="6" md="3">
      <v-card 
        class="summary-card glass-card" 
        variant="flat" 
        :class="{ 'card-clickable': card.clickable }"
        @click="card.clickable && openRecent(card.label)"
      >
        <v-card-text class="d-flex align-center pa-4">
          <div
            class="summary-icon-wrapper mr-3"
            :style="{ background: card.bgColor }"
          >
            <v-icon :color="card.color" size="22">{{ card.icon }}</v-icon>
          </div>
          <div class="summary-info">
            <div class="summary-value">{{ card.value }}</div>
            <div class="summary-label">{{ card.label }}</div>
            <div v-if="card.subtitle" class="summary-subtitle text-truncate">
              {{ card.subtitle }}
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Dialog Recent 5 -->
    <v-dialog v-model="showRecent" max-width="500">
      <v-card class="glass-card" rounded="xl">
        <v-card-title class="pa-5 d-flex align-center justify-space-between">
          <span class="text-h6 font-weight-bold">{{ dialogTitle }}</span>
          <v-btn icon variant="text" size="small" @click="showRecent = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-0">
          <v-list bg-color="transparent" class="py-0">
            <v-list-item v-for="(item, i) in dialogItems" :key="i" class="pa-4 border-b">
              <template v-slot:prepend>
                <div class="list-number mr-3">{{ i + 1 }}</div>
              </template>
              <v-list-item-title class="font-weight-bold text-subtitle-1">
                {{ item['Jenis Alat'] }}
              </v-list-item-title>
              <v-list-item-subtitle class="text-caption mt-1">
                <v-icon size="12" class="mr-1">mdi-calendar</v-icon> {{ formatDate(item.Timestamp) }}
                <span class="mx-1">•</span>
                <v-icon size="12" class="mr-1">mdi-account</v-icon> Petugas IPSRS
              </v-list-item-subtitle>
              <div class="text-caption mt-2 text-grey-darken-1">
                {{ item['Jenis Pekerjaan (Jelaskan part yang diganti / Pekerjaan yang dilakukan)'] || item['Jenis Pekerjaan'] }}
              </div>
            </v-list-item>
            <v-list-item v-if="dialogItems.length === 0" class="pa-5 text-center text-grey">
              Tidak ada data riwayat tersedia.
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  dailyCount: number
  monthlyCount: number
  lastMaintenance: string
  lastMaintenanceTool?: string
  lastReplacement: string
  lastReplacementTool?: string
  recentMaintenance?: any[]
  recentReplacement?: any[]
}>(), {
  lastMaintenanceTool: '-',
  lastReplacementTool: '-',
  recentMaintenance: () => [],
  recentReplacement: () => []
})

const { formatDate } = useBuildings()

const showRecent = ref(false)
const dialogTitle = ref('')
const dialogItems = ref<any[]>([])

const openRecent = (type: string) => {
  if (type === 'Pemeriksaan Terakhir') {
    dialogTitle.value = '5 Pemeriksaan Terakhir'
    dialogItems.value = props.recentMaintenance || []
    showRecent.value = true
  } else if (type === 'Pemeliharaan Terakhir') {
    dialogTitle.value = '5 Pemeliharaan Terakhir'
    dialogItems.value = props.recentReplacement || []
    showRecent.value = true
  }
}

const cards = computed(() => [
  {
    label: 'Pemeliharaan Harian',
    value: props.dailyCount,
    icon: 'mdi-calendar-today',
    color: '#6C63FF',
    bgColor: 'rgba(108, 99, 255, 0.15)',
    clickable: false
  },
  {
    label: 'Pemeliharaan Bulanan',
    value: props.monthlyCount,
    icon: 'mdi-calendar-month',
    color: '#3EC9A7',
    bgColor: 'rgba(62, 201, 167, 0.15)',
    clickable: false
  },
  {
    label: 'Pemeriksaan Terakhir',
    value: formatDate(props.lastMaintenance),
    subtitle: props.lastMaintenanceTool,
    icon: 'mdi-wrench-clock',
    color: '#42A5F5',
    bgColor: 'rgba(66, 165, 245, 0.15)',
    clickable: true
  },
  {
    label: 'Pemeliharaan Terakhir',
    value: formatDate(props.lastReplacement),
    subtitle: props.lastReplacementTool,
    icon: 'mdi-swap-horizontal-circle',
    color: '#FB8C00',
    bgColor: 'rgba(251, 140, 0, 0.15)',
    clickable: true
  },
])
</script>

<style scoped>
.summary-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.summary-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.summary-info {
  min-width: 0;
}

.summary-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.2;
}

.summary-label {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.4);
  font-weight: 600;
  margin-top: 1px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.summary-subtitle {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  margin-top: 2px;
  font-style: italic;
}

.card-clickable {
  cursor: pointer;
}

.card-clickable:active {
  transform: scale(0.98);
}

.list-number {
  width: 24px;
  height: 24px;
  background: rgba(108, 99, 255, 0.1);
  color: #6C63FF;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.border-b {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}
</style>
