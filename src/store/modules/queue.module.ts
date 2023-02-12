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
    clear(state) {
      state.items = [];
      state.cursor = 0;
      state.currentRequestId++;
      state.currentPlaylist = null;
    },
    setQueue(state, items: QueueItem[]) {
      state.items = items;
      state.cursor = 0;
      state.currentPlaylist = null;
      state.currentRequestId++;
    },
    setPlaylist(
      state, 
      payload: { list: string, items: QueueItem[], shuffle?: boolean, cursor: number | null },
    ) {
      state.currentRequestId++;
      if (!payload.shuffle) {
        state.items = payload.items;
      } else {
        const shuffle = payload.items.slice(0);
        state.items = shuffle.sort(() => Math.random() * 2 - 1);
      }
      state.currentPlaylist = payload.list;
      state.cursor = payload.cursor ? payload.cursor : 0;
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
      
      store.commit('setQueue', playlist.list.items);
      store.commit('completeLoading');
    },
    async playPlaylist(store, payload: { list: string, shuffle?: boolean }) {
      store.commit('registerLoading');
      const requestId = store.state.currentRequestId;

      const playlist = await getPlaylist(payload.list);

      if (store.state.currentRequestId !== requestId) return;

      store.commit("setPlaylist", {
        items: playlist.list,
        list: playlist.list.items,
        shuffle: payload.shuffle,
      });
      store.commit('completeLoading');
    },
  },
};
