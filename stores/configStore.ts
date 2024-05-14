import 'dayjs/locale/fa'
import dayjs from 'dayjs'
import jalali from '@zoomit/dayjs-jalali-plugin'
import { computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { LocaleMapping, type LocaleType } from '@/core/types/ConfigModel'
import { DirectionsEnum, LanguagesEnum, SizesEnum } from '@/core/enums'

export const useConfigStore = defineStore('config', () => {
  const configStorage = useLocalStorage("config", {
    dir: DirectionsEnum.RTL as DirectionsEnum,
    locale: LanguagesEnum.FARSI as LocaleType,
    theme: {
      token: {
        colorPrimary: "#3b82f6",
        controlHeight: 42,
        fontFamily: "Vazirmatn FD",
        fontSize: 16,
      },
    },
    size: SizesEnum.Middle as SizesEnum,
  });
  const direction = computed(() => configStorage.value.dir)
  const antLocale = computed(() => configStorage.value.locale)
  const locale = computed(() => LocaleMapping[antLocale.value])
  const theme = computed(() => configStorage.value.theme)
  const size = computed(() => configStorage.value.size)

  dayjs.extend(jalali)
  watch(
    () => configStorage.value.locale,
    () => {
      if (configStorage.value.locale === LanguagesEnum.English) {
        configStorage.value.dir = DirectionsEnum.LTR
        dayjs.calendar('gregory')
      }

      if (configStorage.value.locale === LanguagesEnum.FARSI) {
        configStorage.value.dir = DirectionsEnum.RTL
        dayjs.calendar('jalali')
      }
    }
  )

  return { direction, locale, theme, size, dayjs, configStorage }
})
