import { Module } from "vuex";

import { Playlists, Modules, PlaylistData } from "./modules";

export const playlists: Module<Playlists, Modules> = {
  state: {
    items: [],
  },
  mutations: {
    addPlaylist: (state, playlist: PlaylistData) => {
      if (state.items.find((item) => item.id === playlist.id)) return;
      state.items.push(playlist);
    },
  },
};
