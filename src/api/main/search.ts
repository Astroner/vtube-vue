import { axios } from "@/helpers/axios";
import { SearchEntry } from "@/Responses";

export const searchYoutube = async (query: string) => {
    const { data } = await axios.get<SearchEntry[]>("/search/youtube", {
        params: { query },
    });

    return data;
};

export const searchMusic = async (query: string) => {
    const { data } = await axios.get<SearchEntry[]>("/search/music", {
        params: { query },
    });

    return data;
};
