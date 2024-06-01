<template>
  <LayoutContent class="overflow-y-auto p-6 overflow-hidden">
    <RouterView v-slot="{ Component }">
      <Transition :name="randomAnimation">
        <component :is="Component" v-cloak />
      </Transition>
    </RouterView>
  </LayoutContent>
</template>

<script lang="ts" setup>
import { RouterView, useRouter } from 'vue-router'
import { LayoutContent } from 'ant-design-vue/es'
import { onMounted, reactive, ref } from 'vue'

const randomAnimation = ref('slide-x')
const animations = reactive(['slide-x', 'slide-y'])
const getRandomAnimation = () => {
  const randomIndex = Math.floor(Math.random() * animations.length)
  return animations[randomIndex]
}

onMounted(() => {
  const router = useRouter()
  router.beforeEach((to, from, next) => {
    randomAnimation.value = getRandomAnimation()
    next()
  })
})
</script>

<style>
[v-cloak] {
  display: none;
}
</style>
