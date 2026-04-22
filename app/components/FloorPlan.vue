<template>
  <div class="floor-plan-wrapper">
    <!-- Floor Header -->
    <div class="floor-plan-header mb-4">
      <h2 class="floor-plan-title">
        <span class="gradient-text">{{ buildingName }} — Lantai {{ floorId }}</span>
      </h2>
      <div class="floor-plan-subtitle">
        {{ totalInstallations }} Alat • {{ rooms.length }} ruangan
      </div>
    </div>

    <!-- Floor Plan -->
    <div class="floor-plan">
      
          <!-- uncomment untuk liat debug -->
      <!-- <pre>{{ rooms }}</pre> -->
      <div
        v-for="room in rooms"
        :key="room.id"
        class="room"
        :style="{
          flex: room.flex,
          backgroundColor: room.color,
          borderColor: room.borderColor,
        }"
      >
        <div class="room-label">{{ room.name }}</div>

        <div
          v-for="inst in room.installations"
          :key="inst.id"
          class="installation-card"
          :class="'installation-card--' + inst.status"
          :style="{
            left: inst.posX + '%',
            top: inst.posY + '%',
            width: inst.posW + '%',
            height: inst.posH + '%',
          }"
          @click="$emit('select-installation', inst)"
        >
          <div class="installation-status">
            <span class="status-dot" :class="'status-dot--' + inst.status"></span>
          </div>
          <v-icon
            :size="getIconSize(inst)"
            :color="getTypeColor(inst.type)"
            class="installation-icon"
          >
            {{ getTypeIcon(inst.type) }}
          </v-icon>
          <span class="installation-name" :style="{ fontSize: getNameSize(inst) }">
            {{ inst.name }}
          </span>
          <span
            v-if="isLargeEnough(inst)"
            class="installation-type-badge"
            :style="{ color: getTypeColor(inst.type) }"
          >
            {{ inst.type }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Room, Installation } from '~/composables/useBuildings'

const props = defineProps<{
  rooms: Room[]
  buildingName: string
  floorId: number
}>()

defineEmits<{
  (e: 'select-installation', installation: Installation): void
}>()

const { getTypeColor, getTypeIcon } = useBuildings()

const totalInstallations = computed(() =>
  props.rooms.reduce((sum, r) => sum + r.installations.length, 0)
)

// Adaptive sizing based on installation card area
function getArea(inst: Installation): number {
  return inst.posW * inst.posH
}

function getIconSize(inst: Installation): number {
  const area = getArea(inst)
  if (area < 250) return 14
  if (area < 500) return 16
  return 20
}

function getNameSize(inst: Installation): string {
  const area = getArea(inst)
  if (area < 200) return '0.55rem'
  if (area < 400) return '0.62rem'
  return '0.72rem'
}

function isLargeEnough(inst: Installation): boolean {
  return getArea(inst) > 500
}
</script>

<style scoped>
.floor-plan-header {
  text-align: center;
}

.floor-plan-title {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 4px;
}

.floor-plan-subtitle {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

.floor-plan {
  display: flex;
  gap: 14px;
  min-height: 380px;
}

.room {
  border-radius: 16px;
  border: 2px solid;
  padding: 14px;
  position: relative;
  transition: box-shadow 0.3s ease;
  min-height: 380px;
}

.room:hover {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
}

.room-label {
  position: absolute;
  top: 10px;
  left: 14px;
  font-weight: 700;
  font-size: 0.85rem;
  color: rgba(0, 0, 0, 0.55);
  letter-spacing: 0.5px;
  z-index: 2;
}

/* Absolute-positioned installation cards */
.installation-card {
  position: absolute;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 2px;
  padding: 6px 4px;
  transition: all 0.25s ease;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  z-index: 1;
}

.installation-card:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
  border-color: rgba(108, 99, 255, 0.5);
  z-index: 10;
  background: rgba(255, 255, 255, 0.97);
}

.installation-card--perlu_perhatian {
  border-left: 3px solid #FB8C00;
}

.installation-card--rusak {
  border-left: 3px solid #FF5252;
}

.installation-status {
  position: absolute;
  top: 4px;
  right: 4px;
}

.installation-icon {
  flex-shrink: 0;
}

.installation-name {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.75);
  line-height: 1.15;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.installation-type-badge {
  font-size: 0.58rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
}

/* Responsive */
@media (max-width: 768px) {
  .floor-plan {
    flex-direction: column;
    min-height: auto;
  }

  .room {
    min-height: 280px;
  }
}
</style>
