import { DBTable } from "@/helpers/db/db-table.class";
import { DB } from "@/helpers/db/db.class";
import { getFormats, getInfo } from "@/api/main/player";
import { axios } from "@/helpers/axios";
import { getMidItem } from "@/helpers/functions/getMidItem";
import { DBObservable } from "@/helpers/db/db-observable.class";

export type SavedVideo = {
    title: string,
    thumbnail: Blob,
    code: string,
}

const db = new DB("vtube-storage", 1, {
    list: new DBTable<SavedVideo>(),
    audio: new DBTable<Blob>(),
});

const listObservable = new DBObservable(db, "list");

export const saveMusic = async (code: string) => {
    const [info, formats] = await Promise.all([
        getInfo(code),
        getFormats(code, "audio"),
    ]);

    const format = getMidItem(formats);

    const [thumbnail, video] = await Promise.all([
        axios.get<Blob>(`/player/thumbnail/${code}/`, {
            responseType: "blob",
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

    db.put("audio", code, video);

    db.put("list", code, {
        code,
        thumbnail,
        title: info.title,
    });
};

export const getAllSaved = () => listObservable.getValue();

export const getAudio = (code: string) => db.get("audio", code);

export const getSavedInfo = (code: string) => db.get('list', code);

export const subscribe = listObservable.subscribe.bind(listObservable);

export const isAudioDownloaded = (code: string) => db.has("list", code);

export const deleteSaved = (code: string) => {
    db.delete("list", code);
    db.delete("audio", code);
};

export const deleteAllSaved = () => {
    db.deleteAll("list");
    db.deleteAll("audio");
};
