<template>
  <Form
    layout="vertical"
    :model="formState"
    name="login"
    autocomplete="off"
    @finish="onFinish"
    class="w-full p-2"
  >
    <FormItem :label="t('form.username')" name="username" :rules="[rules.required]">
      <Input v-model:value="formState.username" autocomplete="" />
    </FormItem>
    <FormItem :label="t('form.password')" name="password" :rules="[rules.required, rules.password]">
      <InputPassword v-model:value="formState.password" autocomplete="" />
    </FormItem>
    <Button type="primary" html-type="submit" :loading="isLoading" block class="my-6">
      {{ t('form.login') }}
    </Button>
    <Divider />
    <Button type="link" href="/sfsdf" @click.prevent="$router.push({ name: 'TheAuthForget' })">
      {{ t('form.forget') }}
    </Button>
  </Form>
</template>

<script setup lang="ts">
import { Button, Divider, Form, FormItem, Input, InputPassword } from 'ant-design-vue/es'
import { useAuthStore } from '@/core/stores/authStore'
import { reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useRules } from '@/core/composable/rules'
const { t } = useI18n()
const rules = useRules()
const authStore = useAuthStore()
const isLoading = ref(false)
interface FormState {
  username: string
  password: string
}

const formState = reactive<FormState>({
  username: '',
  password: ''
})

const router = useRouter()
const onFinish = async () => {
  try {
    isLoading.value = !isLoading.value
    await authStore.login(formState)
    router.push({ name: 'TheDashboard' })
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = !isLoading.value
  }
}
</script>
