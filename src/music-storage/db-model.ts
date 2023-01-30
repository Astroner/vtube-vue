import { DBModel } from "@/helpers/db/db-model.class";
import { DBTable } from "@/helpers/db/db-table.class";
import { DB } from "@/helpers/db/db.class";
import { PlaylistAudio, SavedPlaylistV1, SavedPlaylistV2, SavedVideo } from "./music-storage.model";

const storageModel = DBModel
    .create({
        list: new DBTable<SavedVideo>(),
        audio: new DBTable<Blob>(),
    })
    .next(
        {
            all: new DBTable<SavedVideo>(),
            audios: new DBTable<Blob>(),
            playlists: new DBTable<SavedPlaylistV1>(),
            queue: new DBTable<string>(),
        },
        (data) => ({
            all: data.list,
            audios: data.audio,
        }),
    )
    // .extend(
    //     {
    //         playlists: new DBTable<SavedPlaylistV2>(),
    //         playlistAudios: new DBTable<PlaylistAudio, true>(true),
    //     },
    //     (data) => ({
    //         playlists: data.playlists.map((item) => ({
    //             key: item.key,
    //             value: {
    //                 list: item.value.list,
    //                 thumbnail: item.value.thumbnail,
    //                 title: item.value.title,
    //             },
    //         })),
    //         playlistAudios: data.playlists.flatMap((item) => item.value.videos.map(code => ({ code, list: item.value.list }))).map((value, key) => ({ key, value })),
    //     }),
    // )

export const storage = new DB("vtube-storage", storageModel);
