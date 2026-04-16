// composables/useResponsiveHeight.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useResponsiveHeight(heights: { default: number; sm?: number; md?: number; lg?: number; xl?: number }) {
  const height = ref(heights.default)

  const updateHeight = () => {
    if (typeof window === 'undefined') return // Mencegah error saat Server-Side Rendering (SSR)

    const width = window.innerWidth
    if (width >= 1280 && heights.xl) height.value = heights.xl
    else if (width >= 1024 && heights.lg) height.value = heights.lg
    else if (width >= 768 && heights.md) height.value = heights.md
    else if (width >= 640 && heights.sm) height.value = heights.sm
    else height.value = heights.default
  }

  onMounted(() => {
    updateHeight()
    window.addEventListener('resize', updateHeight)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateHeight)
  })

  return { height }
}