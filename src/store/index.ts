import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore } from 'vuex';

import { user } from "./modules/user.module";
import { queue } from "./modules/queue.module";
import { playlists } from "./modules/playlists.module";

export const store = createStore({
  modules: {
    user,
    queue,
    playlists,
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
    (initialStore) => {
      const playlistsKey = "app__storage__playlists";
      const stored = localStorage.getItem(playlistsKey);
      if (stored) {
        try {
          const json = JSON.parse(stored);
          initialStore.state.playlists = json;
        } catch (e) {
          console.error(e);
        }
      }
      initialStore.subscribe((_, state) => {
        localStorage.setItem(playlistsKey, JSON.stringify(state.playlists));
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
