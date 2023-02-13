import { axios } from "@/helpers/axios";
import { MusicChannel } from "@/Responses";

export const getArtist = async (id: string) => {
    const { data } = await axios.get<MusicChannel>(`/channel/music/${id}/`);

    return data;
};
