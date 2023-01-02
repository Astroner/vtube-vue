import { axios } from "@/helpers/axios";
import { MusicCategories } from "@/Responses";

export const getMusicRecommendations = async (token: string) => {
  const { data } = await axios.get<MusicCategories>(`/recommendations/music/`, {
    headers: {
      Authorization: token,
    },
  });

  return data;
};
