import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore } from 'vuex';

import { user } from "./modules/user.module";
import { queue } from "./modules/queue.module";

export const store = createStore({
  modules: {
    user,
    queue,
  },
  plugins: [
    (initialStore) => {
      const tokenKey = "app__storage__token";
      const token = localStorage.getItem(tokenKey);
      if (token) {
        initialStore.state.user.token = token;
      }

      initialStore.subscribe((_, state) => {
        if (state.user.token) localStorage.setItem(tokenKey, state.user.token);
        else localStorage.removeItem(tokenKey);
      });
    },
    async (initialStore) => {
      if (initialStore.state.user.token) {
        setTimeout(() => store.dispatch("fetchInfo"), 0);
      }
    },
  ],
});

export const storeInjectionKey: InjectionKey<typeof store> = Symbol("Store");

export const useStore = () => baseUseStore(storeInjectionKey);
