import { useAlatStore } from '~/stores/alatStore'
import type { AlatData } from '~/types/format'

// ==========================================
// Data Types
// ==========================================

export interface MaintenanceRecord {
  id: number
  date: string
  type: 'pemeliharaan' | 'penggantian'
  description: string
  technician: string
  result: 'baik' | 'perbaikan' | 'penggantian_part'
}

export interface Installation {
  id: string
  name: string
  type: 'kompresor' | 'dryer' | 'vakum'
  status: 'baik' | 'perlu_perhatian' | 'rusak'
  lastMaintenance: string
  lastReplacement: string | null
  dailyCount: number
  monthlyCount: number
  // Position as percentage of room dimensions
  posX: number  // left %
  posY: number  // top %
  posW: number  // width %
  posH: number  // height %
  data: AlatData
  dataList?: AlatData[]
}

export interface Room {
  id: string
  name: string
  color: string
  borderColor: string
  flex: number
  installations: Installation[]
}

export interface Floor {
  id: number
  active: boolean
  label?: string
  rooms: Room[]
}

export interface Building {
  id: string
  name: string
  shortName: string
  icon: string
  totalFloors: number
  floors: Floor[]
}

export interface BuildingSummary {
  totalDaily: number
  totalMonthly: number
  lastMaintenance: string
  lastReplacement: string
  totalInstallations: number
  activeFloors: number
}

// ==========================================
// Mock Data Generator
// ==========================================

// function generateMockRecords(installationName: string, count: number = 6): MaintenanceRecord[] {
//   const technicians = ['Ahmad Fauzi', 'Budi Santoso', 'Cahyo Wibowo', 'Dian Pratama', 'Eko Saputra']
//   const pemeliharaanDescs = [
//     'Pemeliharaan rutin harian',
//     'Pengecekan tekanan dan suhu',
//     'Pembersihan filter udara',
//     'Pengecekan oli dan pelumasan',
//     'Inspeksi visual dan uji fungsi',
//     'Pengecekan kondisi belt dan coupling',
//   ]
//   const penggantianDescs = [
//     'Penggantian filter udara',
//     'Penggantian oli kompresor',
//     'Penggantian seal dan gasket',
//     'Penggantian belt',
//     'Penggantian valve',
//   ]

//   const records: MaintenanceRecord[] = []
//   const now = new Date(2026, 3, 11)

//   for (let i = 0; i < count; i++) {
//     const date = new Date(now)
//     date.setDate(date.getDate() - (i * 5 + Math.floor(Math.random() * 3)))
//     const isPenggantian = i % 4 === 0

//     records.push({
//       id: i + 1,
//       date: date.toISOString().split('T')[0],
//       type: isPenggantian ? 'penggantian' : 'pemeliharaan',
//       description: isPenggantian
//         ? penggantianDescs[i % penggantianDescs.length]
//         : pemeliharaanDescs[i % pemeliharaanDescs.length],
//       technician: technicians[i % technicians.length],
//       result: i === 2 ? 'perbaikan' : isPenggantian ? 'penggantian_part' : 'baik',
//     })
//   }

//   return records
// }

// ==========================================
// Gedung IGD
// ==========================================

const gedungIGD: Building = {
  id: 'igd',
  name: 'Gedung IGD',
  shortName: 'IGD',
  icon: 'mdi-hospital-building',
  totalFloors: 7,
  floors: [
    // === Lantai 7 === (3 Ruangan)
    {
      id: 7,
      active: true,
      rooms: [
        // R1 — Hijau
        {
          id: 'igd-7-r1',
          name: 'R1',
          color: '#E8F5E9',
          borderColor: '#66BB6A',
          flex: 2,
          installations: [
            {
              id: 'igd-7-r1-kb1', name: 'kompressor atlas alfa', type: 'kompresor',
              status: 'baik', lastMaintenance: '2026-04-10', lastReplacement: '2026-03-15',
              dailyCount: 1, monthlyCount: 24,
              posX: 8, posY: 12, posW: 68, posH: 18,
              dataList:[],
              data:{} as AlatData

            },
            {
              id: 'igd-7-r1-kb2', name: 'Kompresor Bebicon 2', type: 'kompresor',
              status: 'baik', lastMaintenance: '2026-04-10', lastReplacement: null,
              dailyCount: 1, monthlyCount: 22,
              posX: 8, posY: 40, posW: 68, posH: 22,
                dataList:[],
              data:{} as AlatData
            },
            
          ],
        },
        // R2 — Kuning
        {
          id: 'igd-7-r2',
          name: 'R2',
          color: '#FFF8E1',
          borderColor: '#FFB74D',
          flex: 4,
          installations: [
            {
              id: 'igd-7-r2-ks1', name: 'Kompresor Swan 1', type: 'kompresor',
              status: 'baik', lastMaintenance: '2026-04-10', lastReplacement: null,
              dailyCount: 1, monthlyCount: 25,
              posX: 5, posY: 26, posW: 40, posH: 14,
              dataList:[],
              data:{} as AlatData
            },
            {
              id: 'igd-7-r2-kb1', name: 'Kompresor Bebicon 1', type: 'kompresor',
              status: 'baik', lastMaintenance: '2026-04-10', lastReplacement: '2026-03-20',
              dailyCount: 1, monthlyCount: 26,
              posX: 52, posY: 26, posW: 42, posH: 14,
              dataList:[],
              data:{} as AlatData
            },
            {
              id: 'igd-7-r2-ks2', name: 'Kompresor Swan 2', type: 'kompresor',
              status: 'perlu_perhatian', lastMaintenance: '2026-04-09', lastReplacement: null,
              dailyCount: 1, monthlyCount: 23,
              posX: 5, posY: 46, posW: 40, posH: 14,
              dataList:[],
              data:{} as AlatData
            },
            {
              id: 'igd-7-r2-kb2', name: 'Kompresor Bebicon 2', type: 'kompresor',
              status: 'baik', lastMaintenance: '2026-04-10', lastReplacement: null,
              dailyCount: 1, monthlyCount: 24,
              posX: 52, posY: 46, posW: 42, posH: 14,
                dataList:[],
              data:{} as AlatData
            },
            {
              id: 'igd-7-r2-kb3', name: 'Kompresor Bebicon 3', type: 'kompresor',
              status: 'baik', lastMaintenance: '2026-04-10', lastReplacement: null,
              dailyCount: 1, monthlyCount: 22,
              posX: 52, posY: 66, posW: 42, posH: 14,
              dataList:[],
              data:{} as AlatData
            },
          ],
        },
        // R3 — Biru
        {
          id: 'igd-7-r3',
          name: 'R3',
          color: '#E3F2FD',
          borderColor: '#42A5F5',
          flex: 3,
          installations: [
            {
              id: 'igd-7-r3-k1', name: 'Komp 1', type: 'kompresor',
              status: 'baik', lastMaintenance: '2026-04-10', lastReplacement: '2026-03-05',
              dailyCount: 1, monthlyCount: 24,
              posX: 38, posY: 12, posW: 20, posH: 26,
              dataList:[],
              data:{} as AlatData
            },
            {
              id: 'igd-7-r3-k2', name: 'Komp 2', type: 'kompresor',
              status: 'baik', lastMaintenance: '2026-04-10', lastReplacement: null,
              dailyCount: 1, monthlyCount: 23,
              posX: 66, posY: 12, posW: 20, posH: 26,
              dataList:[],
              data:{} as AlatData
            },
            {
              id: 'igd-7-r3-v1', name: 'Vakum 1', type: 'vakum',
              status: 'baik', lastMaintenance: '2026-04-11', lastReplacement: '2026-01-15',
              dailyCount: 1, monthlyCount: 25,
              posX: 62, posY: 50, posW: 30, posH: 18,
              dataList:[],
              data:{} as AlatData
            },
            {
              id: 'igd-7-r3-v2', name: 'Vakum 2', type: 'vakum',
              status: 'perlu_perhatian', lastMaintenance: '2026-04-09', lastReplacement: null,
              dailyCount: 1, monthlyCount: 21,
              posX: 62, posY: 74, posW: 30, posH: 18,
              dataList:[],
              data:{} as AlatData
            },
          ],
        },
      ],
    },
    // Lantai 6-3 Non-scope
    { id: 6, active: false, rooms: [] },
    { id: 5, active: false, rooms: [] },
    { id: 4, active: false, rooms: [] },
    { id: 3, active: false, rooms: [] },
    // === Lantai 2 === (1 Ruangan)
    {
      id: 2,
      active: true,
      rooms: [
        {
          id: 'igd-2-r1',
          name: 'R1',
          color: '#E8F5E9',
          borderColor: '#66BB6A',
          flex: 1,
          installations: [
            {
              id: 'igd-2-r1-vb1', name: 'vakum busch alfa', type: 'vakum',
              status: 'baik', lastMaintenance: '2026-04-11', lastReplacement: '2026-03-10',
              dailyCount: 1, monthlyCount: 28,
              posX: 5, posY: 14, posW: 32, posH: 16,
              dataList:[],
              data:{} as AlatData
            },
            {
              id: 'igd-2-r1-vb2', name: 'Vakum Busch 2', type: 'vakum',
              status: 'baik', lastMaintenance: '2026-04-10', lastReplacement: null,
              dailyCount: 1, monthlyCount: 26,
              posX: 5, posY: 38, posW: 32, posH: 16,
              dataList:[],
              data:{} as AlatData
            },
            {
              id: 'igd-2-r1-vk1', name: 'Vakum Becker 1', type: 'vakum',
              status: 'baik', lastMaintenance: '2026-04-10', lastReplacement: '2026-02-28',
              dailyCount: 1, monthlyCount: 25,
              posX: 55, posY: 56, posW: 36, posH: 16,
              dataList:[],
              data:{} as AlatData
            },
            {
              id: 'igd-2-r1-vk2', name: 'Vakum Becker 2', type: 'vakum',
              status: 'perlu_perhatian', lastMaintenance: '2026-04-08', lastReplacement: null,
              dailyCount: 1, monthlyCount: 22,
              posX: 55, posY: 78, posW: 36, posH: 16,
              dataList:[],
              data:{} as AlatData
            },
          ],
        },
      ],
    },
    // === Lantai 1 === (1 Ruangan)
    {
      id: 1,
      active: true,
      rooms: [
        {
          id: 'igd-1-r1',
          name: 'R1',
          color: '#FBE9E7',
          borderColor: '#FF8A65',
          flex: 1,
          installations: [
            {
              id: 'igd-1-r1-kb1', name: 'Komp Bebicon 1', type: 'kompresor',
              status: 'baik', lastMaintenance: '2026-04-11', lastReplacement: '2026-03-22',
              dailyCount: 1, monthlyCount: 27,
              posX: 5, posY: 12, posW: 38, posH: 22,
              dataList:[],
              data:{} as AlatData
            },
            {
              id: 'igd-1-r1-kb2', name: 'Komp Bebicon 2', type: 'kompresor',
              status: 'baik', lastMaintenance: '2026-04-10', lastReplacement: null,
              dailyCount: 1, monthlyCount: 24,
              posX: 5, posY: 48, posW: 38, posH: 22,
              dataList:[],
              data:{} as AlatData
            },
          ],
        },
      ],
    },
  ],
}

// ==========================================
// Gedung NICU
// ==========================================

const gedungNICU: Building = {
  id: 'nicu',
  name: 'Gedung NICU',
  shortName: 'NICU',
  icon: 'mdi-hospital-building',
  totalFloors: 4,
  floors: [
    // === Lantai 4 === (Aktif)
    {
      id: 4,
      active: true,
      rooms: [
        {
          id: 'nicu-4-r1',
          name: 'R1',
          color: '#ECEFF1',
          borderColor: '#90A4AE',
          flex: 1,
          installations: [
            {
              id: 'nicu-4-r1-ac1', name: 'kompressor atlas alfa', type: 'kompresor',
              status: 'baik', lastMaintenance: '2026-04-10', lastReplacement: '2026-02-15',
              dailyCount: 1, monthlyCount: 28,
              posX: 8, posY: 30, posW: 65, posH: 22,
              dataList:[],
              data:{} as AlatData
            },
            {
              id: 'nicu-4-r1-ac2', name: 'Komp Atlas Copco 2', type: 'kompresor',
              status: 'perlu_perhatian', lastMaintenance: '2026-04-09', lastReplacement: null,
              dailyCount: 1, monthlyCount: 25,
              posX: 8, posY: 60, posW: 70, posH: 22,
               dataList:[],
              data:{} as AlatData
            },
          ],
        },
      ],
    },
    // Lantai 3-1 Non-scope
    { id: 3, active: false, rooms: [] },
    { id: 2, active: false, rooms: [] },
    { id: 1, active: false, rooms: [] },
  ],
}

// ==========================================
// Ruang PICU
// ==========================================

const ruangPICU: Building = {
  id: 'picu',
  name: 'Ruang PICU',
  shortName: 'PICU',
  icon: 'mdi-hospital-building',
  totalFloors: 1,
  floors: [
    // === Lantai 1 === (Aktif)
    {
      id: 1,
      active: true,
      rooms: [
        {
          id: 'picu-1-r1',
          name: 'R1',
          color: '#E8F5E9',
          borderColor: '#81C784',
          flex: 1,
          installations: [
            {
              id: 'picu-1-r1-v2', name: 'vakum mils alfa', type: 'vakum',
              status: 'baik', lastMaintenance: '2026-04-10', lastReplacement: '2026-03-18',
              dailyCount: 1, monthlyCount: 24,
              posX: 28, posY: 52, posW: 18, posH: 34,
               dataList:[],
              data:{} as AlatData
            },
            {
              id: 'picu-1-r1-v1', name: 'Vakum 1', type: 'vakum',
              status: 'baik', lastMaintenance: '2026-04-11', lastReplacement: null,
              dailyCount: 1, monthlyCount: 26,
              posX: 68, posY: 52, posW: 18, posH: 34,
               dataList:[],
              data:{} as AlatData
            },
          ],
        },
      ],
    },
  ],
}

// ==========================================
// Grand Pavilliun
// ==========================================

const grandPavilliun: Building = {
  id: 'grand-pavilliun',
  name: 'Grand Pavilliun',
  shortName: 'GP',
  icon: 'mdi-hospital-building',
  totalFloors: 5,
  floors: [
    // Lantai 4-1 Non-scope
    { id: 4, active: false, rooms: [] },
    { id: 3, active: false, rooms: [] },
    { id: 2, active: false, rooms: [] },
    { id: 1, active: false, rooms: [] },
    // === Basement === (Aktif)
    {
      id: 0,
      active: true,
      label: 'Basement',
      rooms: [
        {
          id: 'gp-b-r1',
          name: 'R1',
          color: '#ECEFF1',
          borderColor: '#90A4AE',
          flex: 1,
          installations: [
            {
              id: 'gp-b-r1-kb1', name: 'Komp Bebicon 1', type: 'kompresor',
              status: 'baik', lastMaintenance: '2026-04-10', lastReplacement: '2026-02-20',
              dailyCount: 1, monthlyCount: 28,
              posX: 20, posY: 24, posW: 52, posH: 12,
               dataList:[],
              data:{} as AlatData
            },
            {
              id: 'gp-b-r1-kb2', name: 'Komp Bebicon 2', type: 'kompresor',
              status: 'perlu_perhatian', lastMaintenance: '2026-04-09', lastReplacement: null,
              dailyCount: 1, monthlyCount: 25,
              posX: 25, posY: 42, posW: 52, posH: 12,
               dataList:[],
              data:{} as AlatData
            },
            {
              id: 'gp-b-r1-v1', name: 'Vakum 1', type: 'vakum',
              status: 'baik', lastMaintenance: '2026-04-11', lastReplacement: '2026-03-05',
              dailyCount: 1, monthlyCount: 24,
              posX: 20, posY: 60, posW: 48, posH: 12,
               dataList:[],
              data:{} as AlatData
            },
            {
              id: 'gp-b-r1-v2', name: 'Vakum 2', type: 'vakum',
              status: 'baik', lastMaintenance: '2026-04-10', lastReplacement: null,
              dailyCount: 1, monthlyCount: 23,
              posX: 25, posY: 78, posW: 48, posH: 12,
               dataList:[],
              data:{} as AlatData
            },
          ],
        },
      ],
    },
  ],
}

// ==========================================
// All Buildings
// ==========================================

const buildings: Building[] = [gedungIGD, gedungNICU, ruangPICU, grandPavilliun]

// ==========================================
// Composable
// ==========================================

export const useBuildings = () => {
  const getDynamicStatus = (name: string, defaultStatus: Installation['status']): Installation['status'] => {
    const alatStore = useAlatStore()
    const records = alatStore.dataAlat.filter(i => (i['Jenis Alat'] || '').toLowerCase().includes(name.toLowerCase()))
    if (records.length === 0) return defaultStatus

    // Sort by timestamp (latest first)
    const latest = [...records].sort((a, b) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime())[0]
    const pekerjaan = (latest?.['Jenis Pekerjaan'] ?? '').toLowerCase()

    if (pekerjaan.includes('pemeriksaan')) return 'baik'
    if (pekerjaan.includes('pemeliharaan') || pekerjaan.includes('perbaikan') || pekerjaan.includes('ganti')) return 'perlu_perhatian'

    return defaultStatus
  }

  const getBuildings = (): Building[] => {
    return buildings.map(building => ({
      ...building,
      floors: building.floors.map(floor => ({
        ...floor,
        rooms: floor.rooms.map(room => ({
          ...room,
          installations: room.installations.map(inst => ({
            ...inst,
            status: getDynamicStatus(inst.name, inst.status)
          }))
        }))
      }))
    }))
  }

  const getBuildingById = (id: string): Building | undefined => {
    const b = getBuildings().find((b) => b.id === id)
    return b
  }

  const getFloor = (buildingId: string, floorId: number): Floor | undefined => {
    const building = getBuildingById(buildingId)
    if (!building) return undefined
    return building.floors.find((f) => f.id === floorId)
  }

  const getActiveFloors = (buildingId: string): Floor[] => {
    const building = getBuildingById(buildingId)
    if (!building) return []
    return building.floors.filter((f) => f.active)
  }

  const getAllInstallations = (buildingId: string): Installation[] => {
    const building = getBuildingById(buildingId)
    if (!building) return []
    return building.floors
      .filter((f) => f.active)
      .flatMap((f) => f.rooms.flatMap((r) => r.installations))
  }

  const getFloorInstallations = (buildingId: string, floorId: number): Installation[] => {
    const floor = getFloor(buildingId, floorId)
    if (!floor) return []
    return floor.rooms.flatMap((r) => r.installations)
  }

  const getBuildingSummary = (buildingId: string): BuildingSummary => {
    const installations = getAllInstallations(buildingId)
    const activeFloors = getActiveFloors(buildingId)

    const maintenanceDates = installations.map((i) => i.lastMaintenance).sort().reverse()
    const replacementDates = installations
      .map((i) => i.lastReplacement)
      .filter((d): d is string => d !== null)
      .sort()
      .reverse()

    return {
      totalDaily: installations.reduce((sum, i) => sum + i.dailyCount, 0),
      totalMonthly: installations.reduce((sum, i) => sum + i.monthlyCount, 0),
      lastMaintenance: maintenanceDates[0] || '-',
      lastReplacement: replacementDates[0] || '-',
      totalInstallations: installations.length,
      activeFloors: activeFloors.length,
    }
  }

  const getFloorSummary = (buildingId: string, floorId: number) => {
    const installations = getFloorInstallations(buildingId, floorId)

    const maintenanceDates = installations.map((i) => i.lastMaintenance).sort().reverse()
    const replacementDates = installations
      .map((i) => i.lastReplacement)
      .filter((d): d is string => d !== null)
      .sort()
      .reverse()

    return {
      totalDaily: installations.reduce((sum, i) => sum + i.dailyCount, 0),
      totalMonthly: installations.reduce((sum, i) => sum + i.monthlyCount, 0),
      lastMaintenance: maintenanceDates[0] || '-',
      lastReplacement: replacementDates[0] || '-',
      totalInstallations: installations.length,
    }
  }

  const getInstallationRecords = (installationId: string) => {
    const alatStore = useAlatStore()
    const allInstallations = buildings.flatMap((b) =>
      b.floors.flatMap((f) => f.rooms.flatMap((r) => r.installations))
    )
    const inst = allInstallations.find((i) => i.id === installationId)
    if (!inst) return []

    // Map data from spreadsheet
    // We try to match by name (case insensitive) or type
    return alatStore.dataAlat
      .filter((item) => {
        const itemAlat = (item['Jenis Alat'] || '').toLowerCase()
        const instName = inst.name.toLowerCase()
        // Primary match: name mentioned in sheet
        return itemAlat.includes(instName) || instName.includes(itemAlat)
      })
      .map((item, index) => ({
        id: index,
        date: item.Timestamp,
        type: (item['Jenis Pekerjaan'] || '').toLowerCase().includes('ganti') ? 'penggantian' : 'pemeliharaan',
        description: item['Jenis Pekerjaan (Jelaskan part yang diganti / Pekerjaan yang dilakukan)'] || item['Jenis Pekerjaan'],
        technician: 'Petugas IPSRS', // Placeholder or add to sheet
        result: (item['Jenis Pekerjaan'] || '').toLowerCase().includes('pemeriksaan') ? 'baik' : 'penggantian_part',
        raw: item // Keep raw data for technical parameters
      }))
  }

  const getTypeColor = (type: Installation['type']): string => {
    const colors: Record<string, string> = {
      kompresor: '#42A5F5',
      dryer: '#66BB6A',
      vakum: '#AB47BC',
    }
    return colors[type] || '#78909C'
  }

  const getTypeIcon = (type: Installation['type']): string => {
    const icons: Record<string, string> = {
      kompresor: 'mdi-air-filter',
      dryer: 'mdi-fan',
      vakum: 'mdi-vacuum',
    }
    return icons[type] || 'mdi-wrench'
  }

  const getStatusColor = (status: Installation['status']): string => {
    const colors: Record<string, string> = {
      baik: '#4CAF50',
      perlu_perhatian: '#FB8C00',
      rusak: '#FF5252',
    }
    return colors[status] || '#78909C'
  }

  const getStatusLabel = (status: Installation['status']): string => {
    const labels: Record<string, string> = {
      baik: 'Baik',
      perlu_perhatian: 'Perlu Perhatian',
      rusak: 'Rusak',
    }
    return labels[status] || status
  }

  const formatDate = (date: string): string => {
    if (!date || date === '-') return '-'
    const d = new Date(date)
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getFloorLabel = (buildingId: string, floorId: number): string => {
    const floor = getFloor(buildingId, floorId)
    return floor?.label || `Lantai ${floorId}`
  }

  return {
    getBuildings,
    getBuildingById,
    getFloor,
    getActiveFloors,
    getAllInstallations,
    getFloorInstallations,
    getBuildingSummary,
    getFloorSummary,
    getInstallationRecords,
    getFloorLabel,
    getTypeColor,
    getTypeIcon,
    getStatusColor,
    getStatusLabel,
    formatDate,
  }
}
