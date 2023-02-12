import { fetchThumbnail, getPlaylist } from "@/api/main/playlists";

export const fetchPlaylist = async (list: string) => {
    const playlist = await getPlaylist(list);

    const thumbnail = await fetchThumbnail(list);

    return {
        list,
        thumbnail,
        title: playlist.title,
        videos: playlist.list.items.map((item) => item.code),
    };
};
