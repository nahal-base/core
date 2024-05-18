import { useConfigStore } from '@/core/stores/configStore'
import dayjs from 'dayjs'
import { isDate } from 'lodash'

export const formatDate = (_input: any, format?: string) => {
  const configStore = useConfigStore();
  const dateObject = new Date(_input);

  if (isDate(dateObject) && _input) {
    if (configStore.locale.locale === "en") {
      return dayjs(_input).format(format ?? "YYYY/MM/DD - HH:mm");
    } else if (configStore.locale.locale === "fa") {
      dayjs.calendar("jalali");
      return dayjs(_input).format(format ?? "HH:mm - YYYY/MM/DD");
    }
  } else {
    return "-";
  }
};
