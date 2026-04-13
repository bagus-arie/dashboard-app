<template>
  <div class="building-tower">
    <!-- Building Header -->
    <div class="tower-header">
      <v-icon size="20" color="primary" class="mr-2">{{ building.icon }}</v-icon>
      <span class="tower-title">{{ building.shortName }}</span>
    </div>

    <!-- Floors (top to bottom: highest floor first) -->
    <div class="tower-body">
      <div
        v-for="floor in sortedFloors"
        :key="floor.id"
        class="tower-floor"
        :class="{
          'tower-floor--active': floor.active,
          'tower-floor--inactive': !floor.active,
        }"
        @click="handleFloorClick(floor)"
      >
        <span class="floor-label">
          {{ floor.label || 'Lantai ' + floor.id }}
        </span>
        <v-icon
          v-if="floor.active"
          size="14"
          class="floor-indicator"
        >
          mdi-chevron-right
        </v-icon>
      </div>
    </div>

    <!-- Footer -->
    <div class="tower-footer">
      <span class="tower-footer-text">
        {{ activeCount }} lantai aktif
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Building, Floor } from '~/composables/useBuildings'

const props = defineProps<{
  building: Building
}>()

const emit = defineEmits<{
  (e: 'select-floor', buildingId: string, floorId: number): void
}>()

const { getActiveFloors } = useBuildings()

const activeFloors = computed(() => getActiveFloors(props.building.id))
const activeCount = computed(() => activeFloors.value.length)

// Sort floors by ID descending (highest floor at top)
const sortedFloors = computed(() =>
  [...props.building.floors].sort((a, b) => b.id - a.id)
)

function handleFloorClick(floor: Floor) {
  if (floor.active) {
    emit('select-floor', props.building.id, floor.id)
  }
}
</script>

<style scoped>
.building-tower {
  width: 180px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(108, 99, 255, 0.2);
  background: rgba(26, 29, 46, 0.4);
}

.tower-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 12px;
  background: linear-gradient(135deg, rgba(108, 99, 255, 0.3), rgba(62, 201, 167, 0.2));
  border-bottom: 1px solid rgba(108, 99, 255, 0.2);
}

.tower-title {
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.95);
}

.tower-body {
  display: flex;
  flex-direction: column;
}

.tower-floor {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
  min-height: 42px;
}

.tower-floor--active {
  background: linear-gradient(90deg, rgba(66, 165, 245, 0.15), rgba(66, 165, 245, 0.05));
  cursor: pointer;
}

.tower-floor--active:hover {
  background: linear-gradient(90deg, rgba(66, 165, 245, 0.35), rgba(66, 165, 245, 0.15));
  transform: translateX(4px);
}

.tower-floor--active .floor-label {
  color: #64B5F6;
  font-weight: 600;
  font-size: 0.8rem;
}

.tower-floor--inactive {
  background: rgba(120, 120, 120, 0.08);
  cursor: default;
}

.tower-floor--inactive .floor-label {
  color: rgba(180, 180, 180, 0.4);
  font-weight: 400;
  font-size: 0.8rem;
}

.floor-indicator {
  color: rgba(66, 165, 245, 0.6);
  transition: transform 0.2s ease;
}

.tower-floor--active:hover .floor-indicator {
  transform: translateX(3px);
  color: #64B5F6;
}

.tower-footer {
  padding: 8px 12px;
  background: rgba(108, 99, 255, 0.08);
  border-top: 1px solid rgba(108, 99, 255, 0.15);
  text-align: center;
}

.tower-footer-text {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
