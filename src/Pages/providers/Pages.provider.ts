import { InjectionKey, ref, Ref } from "vue";

import { Name } from "@/components/Icon/Icon.model";

export interface RegisterOptions {
    shortcut?: boolean
    shortcutIcon?: Name
    hidden?: boolean;
    name?: string;
}

export interface PagesAPI {
    register: (id: string, options?: RegisterOptions) => number | string;
    currentIndex: Ref<number | string>;
    goToPage: (name: string) => void
}

export const PagesAPIKey = Symbol("IndexAPI") as InjectionKey<PagesAPI>;

export const PagesAPIDefault: PagesAPI = {
  register: () => {
    console.log("USED OUT OF PROVIDER");
    return 2;
  },
  currentIndex: ref(0),
  goToPage: () => {
    console.log("USED OUT OF PROVIDER");
  },
};
