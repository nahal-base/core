import { computed, h } from "vue";
import data from "@/menus";
import { useI18n } from "vue-i18n";
import { Icon } from "@iconify/vue";

interface MenuItem {
  key: string;
  label: string;
  icon: string;
  children?: MenuItem[];
}
export const useMenus = () => {
  const { t } = useI18n();

  const generateMenuItem = (item: MenuItem) => {
    const menuItem = {
      key: item.label,
      label: t(item.label),
      icon: () => h(Icon, { icon: item.icon }),
    };
    if (item.children) {
      menuItem["children"] = item.children.map((child: MenuItem) => {
        return {
          key: child.label,
          label: t(child.label),
        };
      });
    }
    return menuItem;
  };

  const items = computed(() => {
    return data.map((item) => generateMenuItem(item));
  });

  return { items };
};
