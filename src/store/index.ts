import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore } from 'vuex';

import { vtube } from '@/helpers/vtube-client';

import { user } from "./modules/user.module";
import { queue } from "./modules/queue.module";

export const store = createStore({
  modules: {
    user,
    queue,
  },
  plugins: [
    async (initialStore) => {
      const tokenKey = "app__storage__token";
      const token = localStorage.getItem(tokenKey);
      if (token) {
        initialStore.state.user.session = await vtube.user.restoreSession(token);
        store.dispatch("fetchInfo");
      }

      initialStore.subscribe((_, state) => {
        if (state.user.session) localStorage.setItem(tokenKey, state.user.session.getToken());
        else localStorage.removeItem(tokenKey);
      });
    },
  ],
});

export const storeInjectionKey: InjectionKey<typeof store> = Symbol("Store");

export const useStore = () => baseUseStore(storeInjectionKey);
