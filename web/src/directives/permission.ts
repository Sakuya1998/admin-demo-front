import type { App, DirectiveBinding } from 'vue'
import { useUserStore } from '@/stores/user'

function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
  const { value } = binding
  const userStore = useUserStore()
  const { permissions } = userStore

  if (value && (Array.isArray(value) || typeof value === 'string')) {
    const permissionRoles = Array.isArray(value) ? value : [value]
    const hasPermission = permissions.some((perm) => {
      return perm === '*:*:*' || permissionRoles.includes(perm)
    })

    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  } else {
    // Optionally log error or just do nothing
    console.error(`need roles! Like v-auth="['user:add','user:edit']"`)
  }
}

export default {
  install(app: App) {
    app.directive('auth', {
      mounted(el, binding) {
        checkPermission(el, binding)
      },
      updated(el, binding) {
        checkPermission(el, binding)
      },
    })
  },
}
