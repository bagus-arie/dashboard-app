<template>
  <div>
    <!-- App Bar -->
    <v-app-bar flat class="app-bar" height="60">
      <v-app-bar-nav-icon
        variant="text"
        @click="drawer = !drawer"
        class="d-lg-none"
      />

      <!-- Breadcrumb -->
      <v-breadcrumbs :items="breadcrumbs" class="breadcrumb-nav pa-0 ml-2">
        <template v-slot:divider>
          <v-icon size="14" color="rgba(255,255,255,0.3)">mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>

      <v-spacer />

      <div class="app-bar-right d-flex align-center ga-2">
        <v-chip variant="tonal" color="primary" size="small" prepend-icon="mdi-clock-outline">
          {{ currentTime }}
        </v-chip>
      </div>
    </v-app-bar>

    <!-- Sidebar -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail && !mobile"
      :permanent="!mobile"
      :temporary="mobile"
      class="sidebar"
      width="260"
    >
      <!-- Logo -->
      <div class="sidebar-header" :class="{ 'sidebar-header--rail': rail && !mobile }">
        <div class="logo-wrapper">
          <v-icon size="28" color="primary">mdi-hospital-box</v-icon>
        </div>
        <Transition name="fade">
          <div v-if="!rail || mobile" class="logo-text">
            <div class="logo-title">Monitoring</div>
            <div class="logo-subtitle">Pemeliharaan RS</div>
          </div>
        </Transition>
      </div>

      <v-divider class="mx-3 mb-2" />

      <!-- Navigation -->
      <v-list nav density="compact" class="px-2">
        <!-- Dashboard -->
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Dashboard"
          :to="'/'"
          :active="route.path === '/'"
          color="primary"
          rounded="lg"
          class="mb-1"
        />

        <v-divider class="my-2" />

        <!-- Buildings -->
        <div class="nav-section-label" v-if="!rail || mobile">GEDUNG</div>

        <v-list-group
          v-for="building in buildings"
          :key="building.id"
          :value="building.id"
        >
          <template v-slot:activator="{ props: activatorProps }">
            <v-list-item
              v-bind="activatorProps"
              :prepend-icon="building.icon"
              :title="building.name"
              color="primary"
              rounded="lg"
            />
          </template>

          <v-list-item
            v-for="floor in getActiveFloors(building.id)"
            :key="floor.id"
            :title="`Lantai ${floor.id}`"
            :to="`/gedung/${building.id}/lantai/${floor.id}`"
            prepend-icon="mdi-floor-plan"
            color="secondary"
            rounded="lg"
            density="compact"
            class="ml-2"
          />
        </v-list-group>
      </v-list>

      <template v-slot:append>
        <div class="sidebar-footer pa-3" v-if="!mobile">
          <v-btn
            :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
            variant="text"
            size="small"
            block
            @click="rail = !rail"
            color="primary"
          />
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="main-content">
      <v-container fluid class="pa-5">
        <slot />
      </v-container>
    </v-main>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const route = useRoute()
const { getBuildings, getActiveFloors, getBuildingById } = useBuildings()
const { mobile } = useDisplay()

const drawer = ref(true)
const rail = ref(false)

const buildings = computed(() => getBuildings())

// Current time display
const currentTime = ref('')
const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
updateTime()
let timer: ReturnType<typeof setInterval>
onMounted(() => {
  timer = setInterval(updateTime, 60000)
})
onUnmounted(() => {
  clearInterval(timer)
})

// Breadcrumbs
const breadcrumbs = computed(() => {
  const crumbs: Array<{ title: string; to?: string; disabled?: boolean }> = [
    { title: 'Dashboard', to: '/' },
  ]

  const buildingId = route.params.buildingId as string
  const floorId = route.params.floorId as string

  if (buildingId) {
    const building = getBuildingById(buildingId)
    if (building) {
      crumbs.push({ title: building.name, disabled: true })
    }
  }

  if (floorId) {
    crumbs.push({ title: `Lantai ${floorId}`, disabled: true })
  }

  return crumbs
})
</script>

<style scoped>
.app-bar {
  background: rgba(15, 17, 23, 0.8) !important;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(108, 99, 255, 0.1);
}

.breadcrumb-nav :deep(.v-breadcrumbs-item) {
  font-size: 0.82rem;
  font-weight: 500;
}

.sidebar {
  background: rgba(15, 17, 23, 0.95) !important;
  border-right: 1px solid rgba(108, 99, 255, 0.1) !important;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 16px 12px;
  transition: all 0.3s ease;
}

.sidebar-header--rail {
  justify-content: center;
  padding: 16px 8px 12px;
}

.logo-wrapper {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(108, 99, 255, 0.2), rgba(62, 201, 167, 0.15));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.1;
}

.logo-subtitle {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.45);
  font-weight: 500;
}

.nav-section-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 1px;
  padding: 8px 16px 4px;
}

.sidebar-footer {
  border-top: 1px solid rgba(108, 99, 255, 0.1);
}

.main-content {
  background: linear-gradient(180deg, #0F1117 0%, #141622 100%);
  min-height: 100vh;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.app-bar-right {
  margin-right: 8px;
}
</style>
