import { axios } from "@/helpers/axios";

import { Playlist } from "@/Responses";

export const getDynamicPlaylist = async (psid: string, list: string, code: string) => {
  const { data } = await axios.get<Playlist>(`/playlist/dynamic/${psid}/${list}/${code}/`);

  return data;
};

export const getPlaylist = async (list: string) => {
  const { data } = await axios.get<Playlist>(`/playlist/${list}/`);

  return data;
};
