import { InjectionKey, ref, Ref } from "vue";

export interface MenuAPI {
  currentItem: Ref<number | null>;
  total: Ref<number>;
  register: (name: string | number, label: string) => number;
  calcPosition: (index: number, total: number) => { x: number, y: number };
}

export const MenuAPIKey = Symbol("MenuAPI") as InjectionKey<MenuAPI>;

export const MenuAPIKeyDefaultValue: MenuAPI = {
  currentItem: ref(null),
  total: ref(0),
  register: () => {
    throw new Error("Menu API used out of provider");
  },
  calcPosition: () => {
    throw new Error("Menu API used out of provider");
  },
};
