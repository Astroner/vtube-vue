import { axios } from "@/helpers/axios";

import { Playlist, PlaylistWithID } from "@/Responses";

export const getDynamicPlaylist = async (token: string, list: string, code: string) => {
  const { data } = await axios.get<Playlist>(`/playlist/dynamic/${list}/${code}/`, {
    headers: {
      Authorization: token,
    },
  });

  return data;
};

export const getPlaylist = async (list: string) => {
  const { data } = await axios.get<Playlist>(`/playlist/${list}/`);

  return data;
};

export const getUserPlaylists = async (token: string) => {
  const { data } = await axios.get<PlaylistWithID[]>("/playlist/all", {
    headers: {
      Authorization: token,
    },
  });

  return data;
};
