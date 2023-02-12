import { axios } from "@/helpers/axios";
import { VideoFormat, YTVideo } from "@/Responses";

export const getFormats = async (code: string, type = "audio") => {
  const { data } = await axios.get<VideoFormat[]>(`/player/formats/${code}/`, {
    params: { type },
  });

  return data;
};

export const getInfo = async (code: string) => {
  const { data } = await axios.get<YTVideo>(`/player/info/${code}/`);

  return data;
};

export const fetchThumbnail = async (code: string) => {
  const { data } = await axios.get<Blob>(`/player/thumbnail/${code}/`, {
    responseType: "blob",
  });

  return data;
};
