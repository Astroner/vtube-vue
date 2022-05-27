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
      const psidKey = "app__storage__psid";
      const psid = localStorage.getItem(psidKey);
      if (psid) {
        initialStore.state.user.psid = psid;
      }

      initialStore.subscribe((_, state) => {
        if (state.user.psid) localStorage.setItem(psidKey, state.user.psid);
        else localStorage.removeItem(psidKey);
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
  ],
});

export const storeInjectionKey: InjectionKey<typeof store> = Symbol("Store");

export const useStore = () => baseUseStore(storeInjectionKey);
