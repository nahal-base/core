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

interface GeneratedMenuItem {
  key: string;
  label: string;
  icon?: () => ReturnType<typeof h>;
  children?: GeneratedMenuItem[];
}

export const useMenus = () => {
  const { t } = useI18n();

  const generateMenuItem = (item: MenuItem): GeneratedMenuItem => {
    const menuItem: GeneratedMenuItem = {
      key: item.key,
      label: t(item.label),
      icon: () => h(Icon, { icon: item.icon }),
    };
    if (item.children) {
      menuItem.children = item.children.map((child: MenuItem) => {
        return {
          key: child.key,
          label: t(child.label),
        } as GeneratedMenuItem;
      });
    }
    return menuItem;
  };

  const items = computed(() => {
    return data.map((item: MenuItem) => generateMenuItem(item));
  });

  return { items };
};
