import { axios } from "@/helpers/axios";
import { YTPlaylist, YTPlaylistWithID } from "@/Responses";

export const getDynamicPlaylist = async (token: string, list: string, code: string) => {
  const { data } = await axios.get<YTPlaylist>(`/playlist/dynamic/${list}/${code}/`, {
    headers: {
      Authorization: token,
    },
  });

  return data;
};

export const getPlaylist = async (list: string) => {
  const { data } = await axios.get<YTPlaylist>(`/playlist/${list}/`);

  return data;
};

export const getUserPlaylists = async (token: string) => {
  const { data } = await axios.get<YTPlaylistWithID[]>("/playlist/all", {
    headers: {
      Authorization: token,
    },
  });

  return data;
};
