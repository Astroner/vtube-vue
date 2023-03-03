import { axios } from "@/helpers/axios";
import { Page, YoutubeChannel, YTVideo } from "@/Responses";

export const getChannelInfo = async (id: string) => {
    const { data } = await axios.get<YoutubeChannel>(`/channel/youtube/${id}/`);

    return data;
};

export const getChannelVideos = async (id: string, continuation?: string) => {
    const { data } = await axios.get<Page<YTVideo>>(
        continuation ? `/channel/youtube/videos/continue/${continuation}/` : `/channel/youtube/videos/${id}/`,
    );

    return data;
};
