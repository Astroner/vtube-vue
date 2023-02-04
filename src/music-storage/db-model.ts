import {
    DB,
    DBColumn,
    DBModel,
    DBSTable,
    DBTable,
} from "@dogonis/db";
import { SavedPlaylistV1, SavedPlaylistV2, SavedVideo } from "./music-storage.model";

const storageModel = DBModel
    .create({
        list: new DBSTable<SavedVideo>(),
        audio: new DBSTable<Blob>(),
    })
    .next(
        {
            all: new DBSTable<SavedVideo>(),
            audios: new DBSTable<Blob>(),
            playlists: new DBSTable<SavedPlaylistV1>(),
            queue: new DBSTable<string>(),
        },
        (data) => ({
            all: data.list,
            audios: data.audio,
            playlists: [],
            queue: [],
        }),
    )
    .extend(
        {
            playlists: new DBSTable<SavedPlaylistV2>(),
            playlistAudios: new DBTable({
                list: new DBColumn<string, true>(true),
                code: new DBColumn<string, true>(true),
            }),
        },
        (data) => ({
            playlists: data.playlists.map((item) => ({
                key: item.key,
                value: {
                    list: item.value.list,
                    thumbnail: item.value.thumbnail,
                    title: item.value.title,
                },
            })),
            playlistAudios: data.playlists
                .flatMap(
                    (item) => item.value.videos.map((code) => ({ code, list: item.value.list })),
                )
                .map((value, key) => ({ key, value })),
            all: data.all,
            audios: data.audios,
            queue: data.queue,
        }),
    );

export const storage = new DB("vtube-storage", storageModel);
