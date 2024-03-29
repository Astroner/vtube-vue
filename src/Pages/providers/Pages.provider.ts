import { InjectionKey, ref, Ref } from "vue";

import { Name } from "@/components/Icon/Icon.model";

export interface RegisterOptions {
    shortcut?: boolean
    shortcutIcon?: Name
    hidden?: boolean;
    name?: string;
    leftShift?: number;
}

export interface PagesAPI {
    register: (id: string, options?: RegisterOptions) => number | string;
    currentIndex: Ref<number | string>;
    goToPage: (name: string, payload?: any) => void;
    pagePayload: Ref<any>;
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
  pagePayload: ref(null),
};
