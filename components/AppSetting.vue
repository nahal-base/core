<template>
  <div>
    <AzButton
      icon="tabler:settings"
      type="text"
      class="text-white"
      @click.prevent="showModal"
    />
    <Modal v-model:open="open" @ok="handleOk">
      <template #title>
        تنظیمات
        <Divider />
      </template>
      <Form layout="vertical" class="">
        <FormItem :label="t('panel.language')">
          <Select v-model:value="configStore.configStorage.locale">
            <SelectOption :value="LanguagesEnum.FARSI">فارسی</SelectOption>
            <SelectOption :value="LanguagesEnum.English">English</SelectOption>
          </Select>
        </FormItem>
        <FormItem :label="t('panel.color')">
          <RadioGroup
            v-model:value="configStore.configStorage.theme.token.colorPrimary"
            @change="onChangeColor"
          >
            <RadioButton value="#3b82f6" class="!bg-[#3b82f6]"></RadioButton>
            <!-- <RadioButton value="#ef4444" class="!bg-[#ef4444]"></RadioButton> -->
            <!-- <RadioButton value="#f97316" class="!bg-[#f97316]"></RadioButton> -->
            <!-- <RadioButton value="#eab308" class="!bg-[#eab308]"></RadioButton> -->
            <!-- <RadioButton value="#84cc16" class="!bg-[#84cc16]"></RadioButton> -->
            <RadioButton value="#10b981" class="!bg-[#10b981]"></RadioButton>
            <RadioButton value="#06b6d4" class="!bg-[#06b6d4]"></RadioButton>
            <RadioButton value="#0ea5e9" class="!bg-[#0ea5e9]"></RadioButton>
            <RadioButton value="#3b82f6" class="!bg-[#3b82f6]"></RadioButton>
            <RadioButton value="#6366f1" class="!bg-[#6366f1]"></RadioButton>
            <!-- <RadioButton value="#8b5cf6" class="!bg-[#8b5cf6]"></RadioButton> -->
            <!-- <RadioButton value="#d946ef" class="!bg-[#d946ef]"></RadioButton> -->
            <!-- <RadioButton value="#ec4899" class="!bg-[#ec4899]"></RadioButton> -->
            <!-- <RadioButton value="#f43f5e" class="!bg-[#f43f5e]"></RadioButton> -->
          </RadioGroup>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import {
  Divider,
  Form,
  FormItem,
  Modal,
  RadioButton,
  RadioGroup,
  Select,
  SelectOption,
} from "ant-design-vue/es";
import { useConfigStore } from "@/core/stores/configStore";
import { useCssVar } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import { AzButton } from "@/core/components";
import { LanguagesEnum } from "@/core/enums";
import type { RadioChangeEvent } from "ant-design-vue/es/radio/interface";

const { t } = useI18n();

const primaryColor = useCssVar("--primary-color");
const onChangeColor = (e: RadioChangeEvent) => {
  const selectedColor = (e.target as HTMLInputElement).value;
  primaryColor.value = selectedColor;
  configStore.configStorage.theme.token.colorPrimary = selectedColor;
};
const configStore = useConfigStore();

const open = ref<boolean>(false);

const showModal = () => {
  open.value = true;
};

const handleOk = (e: MouseEvent) => {
  open.value = false;
};
</script>

<style lang="less">
.ant-radio-group {
  @apply rounded border border-solid border-gray-200 p-4 !grid grid-cols-7 gap-4 w-max h-max;
  flex-wrap: wrap !important;
  .ant-radio-button-wrapper {
    @apply w-6 h-6 !rounded-full p-0 leading-0 border-2 border-transparent;
    &::before {
      display: none !important;
    }
    &:last-child {
      border-start-end-radius: 50%;
      border-end-end-radius: 50%;
    }
    &:first-child {
      border-start-start-radius: 50%;
      border-end-start-radius: 50%;
    }
  }
}
</style>
