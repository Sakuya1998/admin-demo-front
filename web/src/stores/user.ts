import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login as loginApi, getUserInfo, logout as logoutApi } from '@/api/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>('')
  const username = ref<string>('')
  const roles = ref<string[]>([])
  const permissions = ref<string[]>([])
  const avatar = ref<string>('')

  const login = async (loginForm: any) => {
    try {
      const res: any = await loginApi(loginForm)
      if (res.code === 200) {
        token.value = res.data.token
        // In a real app, you might want to persist token
        // localStorage.setItem('token', res.data.token)
        await getInfo()
        return true
      }
      return false
    } catch (error) {
      console.error(error)
      return false
    }
  }

  const getInfo = async () => {
    try {
      const res: any = await getUserInfo()
      if (res.code === 200) {
        const data = res.data
        username.value = data.username
        roles.value = data.roles
        permissions.value = data.permissions
        avatar.value = data.avatar
      }
    } catch (error) {
      console.error(error)
    }
  }

  const logout = async () => {
    try {
      await logoutApi()
    } finally {
      token.value = ''
      username.value = ''
      roles.value = []
      permissions.value = []
    }
  }

  return {
    token,
    username,
    roles,
    permissions,
    avatar,
    login,
    getInfo,
    logout,
  }
})
