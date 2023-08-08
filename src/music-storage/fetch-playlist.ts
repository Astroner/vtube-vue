import { axios } from "@/helpers/axios";
import { getMidItem } from "@/helpers/functions/getMidItem";
import { vtube } from "@/helpers/vtube-client";

export const fetchPlaylist = async (list: string) => {
    const playlist = await vtube.getPlaylist(list);

    const thumbnail = await axios.get<Blob>(getMidItem(playlist.display).url, {
        responseType: 'blob',
    }).then((res) => res.data);

    return {
        list,
        thumbnail,
        title: playlist.title,
        videos: playlist.list.items.map((item) => item.code),
    };
};
