import { Module } from "vuex";

import { getDynamicPlaylist, getPlaylist } from "@/api/main/playlists";

import { Modules, QueueItem, QueueState } from "./modules";

export const queue: Module<QueueState, Modules> = {
  state: {
    items: [],
    cursor: 0,
    currentRequestId: 0,
    isLoading: false,
    currentPlaylist: null,
  },
  mutations: {
    addItem(state, item: QueueItem) {
      state.items.push(item);
    },
    setCursor(state, nextCursor: number) {
      if (nextCursor >= 0 && nextCursor < state.items.length) {
        state.cursor = nextCursor;
      }
    },
    next(state) {
      const next = state.cursor + 1;
      if (next < state.items.length) {
        state.cursor = next;
      }
    },
    prev(state) {
      const prev = state.cursor - 1;
      if (prev >= 0) {
        state.cursor = prev;
      }
    },
    setQueue(state, items: QueueItem[]) {
      state.items = items;
      state.cursor = 0;
    },
    setQueueAndShuffle(state, items: QueueItem[]) {
      const shuffle = items.slice(0);
      state.items = shuffle.sort(() => Math.random() * 2 - 1);
      state.cursor = 0;
    },
    registerLoading(state) {
      state.isLoading = true;
      state.currentRequestId++;
    },
    completeLoading(state) {
      state.isLoading = false;
    },
  },
  actions: {
    async playDynamicPlaylist(store, payload: { list: string, code: string }) {
      if (!store.rootState.user.token) return;

      store.commit('registerLoading');
      const requestId = store.state.currentRequestId;

      const playlist = await getDynamicPlaylist(
        store.rootState.user.token,
        payload.list,
        payload.code,
      );

      if (store.state.currentRequestId !== requestId) return;

      store.commit('setQueue', playlist.list);
      store.commit('completeLoading');
    },
    async playPlaylist(store, payload: { list: string, shuffle?: boolean }) {
      store.commit('registerLoading');
      const requestId = store.state.currentRequestId;

      const playlist = await getPlaylist(payload.list);

      if (store.state.currentRequestId !== requestId) return;

      store.commit('setQueue', playlist.list.sort(() => Math.random() * 2 - 1));
      store.commit('completeLoading');
    },
  },
};
