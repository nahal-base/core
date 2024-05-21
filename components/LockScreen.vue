<template>
  <div>
    <AzButton icon="tabler:lock" type="text" class="text-white" @click.prevent="showModal" />
    <Modal
      v-model:open="open"
      width="100%"
      :closable="false"
      wrap-class-name="full-modal"
      @ok="handleOk"
    >
      <img class="w-2/3 mx-auto block mb-12 mt-20" src="/logo-3.png" alt="" />
      <Form layout="vertical">
        <FormItem label="username" prop="username">
          <Input />
        </FormItem>

        <FormItem label="password" prop="password">
          <Input />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { Form, FormItem, Input, Modal } from 'ant-design-vue/es'
import { AzButton } from '@/core/components'

const open = ref<boolean>(false)

const showModal = () => {
  open.value = true
}

const handleOk = (e: MouseEvent) => {
  open.value = false
}
</script>
<style lang="less">
.full-modal {
  background-image: url('../assets/images/panel/lock-screen.jpg');

  .ant-modal {
    @apply max-w-full top-0 pb-0 m-0 h-screen;
  }
  .ant-modal-content {
    @apply flex flex-col rounded-0 w-100 h-screen rounded !shadow;
  }
  .ant-modal-body {
    @apply flex-1;
  }
}
</style>
