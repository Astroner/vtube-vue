import { Module } from "vuex";

import { getDynamicPlaylist, getPlaylist } from "@/api/main/playlists";

import { Modules, QueueItem, QueueState } from "./modules";

export const queue: Module<QueueState, Modules> = {
  state: {
    items: [],
    cursor: 0,
    currentRequestId: 0,
    isLoading: false,
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
      if (!store.rootState.user.psid) return;

      store.commit('registerLoading');
      const requestId = store.state.currentRequestId;

      const playlist = await getDynamicPlaylist(
        store.rootState.user.psid,
        payload.list,
        payload.code,
      );

      if (store.state.currentRequestId !== requestId) return;

      store.commit('setQueue', playlist.list);
      store.commit('completeLoading');
    },
    async playPlaylist(store, payload: string) {
      store.commit('registerLoading');
      const requestId = store.state.currentRequestId;

      const playlist = await getPlaylist(payload);

      if (store.state.currentRequestId !== requestId) return;

      store.commit('setQueue', playlist.list);
      store.commit('completeLoading');
    },
  },
};
