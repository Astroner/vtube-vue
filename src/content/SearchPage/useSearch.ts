import { computed, ref, watchEffect } from "vue";

import { useStore } from "@/store";
import { asyncComputed } from "@/helpers/hooks/asyncComputed";
import { MediaInfo, Playlist } from "@/Responses";
import { getInfo } from "@/api/main/player";
import { getDynamicPlaylist, getPlaylist } from "@/api/main/playlists";

import { parseUserInput } from "./parseUserInput";

export const useSearch = () => {
  const store = useStore();

  const value = ref("");
  const isSearching = ref(false);

  const token = computed(() => store.state.user.token);

  const processed = computed(() => {
    if (!value.value) return null;

    return parseUserInput(value.value);
  });

  const [isLoading, info] = asyncComputed<
    | { type: "VIDEO", info: MediaInfo, code: string }
    | { type: "DYNAMIC_PLAYLIST", info: Playlist, }
    | { type: "PLAYLIST", info: Playlist, id: string }
  >(() => {
    if (!isSearching.value || !processed.value) return "EXIT";

    if (processed.value.type === "VIDEO") {
      const video = processed.value;
      return getInfo(video.value)
        .then((data) => ({
          type: "VIDEO",
          info: data,
          code: video.value,
        }));
    }

    if (processed.value.type === "PLAYLIST") {
      const playlist = processed.value;
      return getPlaylist(
        processed.value.value,
      )
        .then((data) => ({
          id: playlist.value,
          type: "PLAYLIST",
          info: data,
        }));
    }

    if (!token.value) return "EXIT";

    if (processed.value.type === "DYNAMIC_PLAYLIST") {
      return getDynamicPlaylist(
        token.value,
        processed.value.value.list,
        processed.value.value.code,
      )
        .then((data) => ({
          type: "DYNAMIC_PLAYLIST",
          info: data,
        }));
    }

    return "EXIT";
  });

  watchEffect(() => {
    if (!value.value) {
      isSearching.value = false;
    }
  });

  return {
    value,
    isLoading,
    isSearching,
    info,
    processed,
    reset: () => {
      isSearching.value = false;
      value.value = "";
    },
  };
};
