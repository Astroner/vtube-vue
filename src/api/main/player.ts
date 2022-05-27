import { axios } from "@/helpers/axios";
import { MediaFormat, MediaInfo } from "@/Responses";

export const getFormats = async (code: string, type = "audio") => {
  const { data } = await axios.get<MediaFormat[]>(`/player/formats/${code}/`, {
    params: { type },
  });

  return data;
};

export const getInfo = async (code: string) => {
  const { data } = await axios.get<MediaInfo>(`/player/info/${code}/`);

  return data;
};
