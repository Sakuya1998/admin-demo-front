import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ThemeType = 'dark' | 'light'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<ThemeType>('dark')

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    updateThemeAttribute()
  }

  const setTheme = (newTheme: ThemeType) => {
    theme.value = newTheme
    updateThemeAttribute()
  }

  const updateThemeAttribute = () => {
    document.documentElement.setAttribute('data-theme', theme.value)
  }

  // Initialize
  updateThemeAttribute()

  return {
    theme,
    toggleTheme,
    setTheme
  }
})
