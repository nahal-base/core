import { useBase } from '@/Base'
import { computed } from 'vue'

export const useRoutes = () => {
  const { items } = useBase()

  const routes = computed(() => {
    return items.value.map((item) => {
      const route = {
        path: item.path ? `/${item.path}` : '/',
        name: item.key,
        component: item.component
      }

      if (item.children) {
        route.children = item.children.map((child) => ({
          path: `${item.path}/${child.path}`,
          name: child.key,
          component: child.component
        }))
      }

      return route
    })
  })

  return { items: routes.value }
}
