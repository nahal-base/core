import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/core/utils/authentication'
import routes from '@/routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      name: 'TheApp',
      component: () => import('@/core/layouts/AppLayout.vue'),
      children: [
        {
          path: '',
          name: 'ThePanel',
          component: () => import('@/core/layouts/PanelLayout/PanelLayout.vue'),
          children: [...routes]
        },
        {
          path: 'auth',
          name: 'TheAuth',
          component: () => import('@/core/layouts/AuthLayout.vue'),
          children: [
            {
              path: 'login',
              name: 'TheAuthLogin',
              component: () => import('@/core/pages/TheLogin.vue')
            },
            {
              path: 'forget',
              name: 'TheAuthForget',
              component: () => import('@/core/pages/TheLogin.vue')
            }
          ]
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'TheAuthLogin' && !isAuthenticated()) {
    next({ name: 'TheAuthLogin' })
  } else {
    next()
  }
})

export default router
