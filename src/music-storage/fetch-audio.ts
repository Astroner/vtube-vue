import { axios } from "@/helpers/axios";
import { getMidItem } from "@/helpers/functions/getMidItem";
import { vtube } from "@/helpers/vtube-client";

export type FetchedAudio = {
    audio: Blob,
    thumbnail: Blob,
    title: string,
    code: string,
}

export const fetchAudio = async (code: string): Promise<FetchedAudio> => {
    const [info, formats] = await Promise.all([
        vtube.video.info(code),
        vtube.video.formats(code, "audio"),
    ]);

    const format = getMidItem(formats);

    const [thumbnail, audio] = await Promise.all([
        axios.get<Blob>(getMidItem(info.display).url, {
            responseType: 'blob',
        }).then((res) => res.data),
        axios.get<Blob>(`/player/${code}/`, {
            params: {
                itag: format.itag,
            },
            headers: {
                range: `bytes=0-${format.contentLength - 1}`,
            },
            responseType: 'blob',
        }).then((res) => res.data),
    ]);

    return {
        audio,
        thumbnail,
        title: info.title,
        code,
    };
};
