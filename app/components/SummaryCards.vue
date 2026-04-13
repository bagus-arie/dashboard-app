<template>
  <v-row dense>
    <v-col v-for="card in cards" :key="card.label" cols="6" md="3">
      <v-card class="summary-card glass-card" variant="flat">
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
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const props = defineProps<{
  dailyCount: number
  monthlyCount: number
  lastMaintenance: string
  lastReplacement: string
}>()

const { formatDate } = useBuildings()

const cards = computed(() => [
  {
    label: 'Pemeliharaan Harian',
    value: props.dailyCount,
    icon: 'mdi-calendar-today',
    color: '#6C63FF',
    bgColor: 'rgba(108, 99, 255, 0.15)',
  },
  {
    label: 'Pemeliharaan Bulanan',
    value: props.monthlyCount,
    icon: 'mdi-calendar-month',
    color: '#3EC9A7',
    bgColor: 'rgba(62, 201, 167, 0.15)',
  },
  {
    label: 'Pemeliharaan Terakhir',
    value: formatDate(props.lastMaintenance),
    icon: 'mdi-wrench-clock',
    color: '#42A5F5',
    bgColor: 'rgba(66, 165, 245, 0.15)',
  },
  {
    label: 'Penggantian Terakhir',
    value: formatDate(props.lastReplacement),
    icon: 'mdi-swap-horizontal-circle',
    color: '#FB8C00',
    bgColor: 'rgba(251, 140, 0, 0.15)',
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
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
</style>
