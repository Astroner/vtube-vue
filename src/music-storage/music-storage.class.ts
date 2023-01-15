import { DBModel } from "@/helpers/db/db-model.class";
import { DBObservable } from "@/helpers/db/db-observable.class";
import { DBTable } from "@/helpers/db/db-table.class";
import { DB } from "@/helpers/db/db.class";
import { DownloadQueue } from "./download-queue.class";
import { fetchPlaylist } from "./fetch-playlist";
import { 
    SavedPlaylist,
    SavedVideo,
} from "./music-storage.model";

export class MusicStorage {
    private storageModel = DBModel
        .create({
            list: new DBTable<SavedVideo>(),
            audio: new DBTable<Blob>(),
        })
        .next(
            {
                all: new DBTable<SavedVideo>(),
                audios: new DBTable<Blob>(),
                playlists: new DBTable<SavedPlaylist>(),
                queue: new DBTable<string>(),
            },
            (data) => ({
                all: data.list,
                audios: data.audio,
            }),
        )

    private storage = new DB("vtube-storage", this.storageModel);

    private downloadQueue = new DownloadQueue(2);

    public savedPlaylists = new DBObservable(this.storage, "playlists");

    public queue = new DBObservable(this.storage, "queue");

    // TODO: delete this observable coz it costs tooo much
    public all = new DBObservable(this.storage, "all");

    constructor() {
        this.downloadQueue.onDownloadCompleted = async (audio) => {
            await Promise.all([
                this.storage.put("all", audio.code, {
                    code: audio.code,
                    thumbnail: audio.thumbnail,
                    title: audio.title,
                }),
                this.storage.put("audios", audio.code, audio.audio),
                this.storage.delete("queue", audio.code),
            ]);
        };
        this.downloadQueue.onDownloadFailure = (code, error) => {
            if (error.response?.status === 404) {
                this.storage.delete("queue", code);
            } else {
                this.downloadQueue.add(code);
            }
        };

        this.storage.getAll("queue")
            .then((queue) => queue.forEach((item) => this.downloadQueue.add(item)));
    }

    getPlaylist(list: string) {
        return this.storage.get("playlists", list);
    }

    async savePlaylist(list: string) {
        const playlist = await fetchPlaylist(list);

        this.storage.put("playlists", playlist.list, playlist);

        for (const video of playlist.videos) {
            this.saveAudio(video);
        }
    }

    async saveAudio(code: string) {
        if (await this.isAudioDownloaded(code)) return;
        await this.storage.put("queue", code, code);
        this.downloadQueue.add(code);
    }

    async getAllSaved() {
        return this.all.getValue();
    }

    async getAudio(code: string) {
        return this.storage.get("audios", code);
    }

    async getSavedInfo(code: string) {
        return this.storage.get("all", code);
    }

    async isAudioDownloaded(code: string) {
        return this.storage.has("all", code);
    }

    async deleteSaved(code: string) {
        return Promise.all([
            this.storage.delete("all", code),
            this.storage.delete("audios", code),
        ]);
    }

    async deleteAllSaved() {
        return Promise.all([
            this.storage.deleteAll("all"),
            this.storage.deleteAll("audios"),
            this.storage.deleteAll("playlists"),
        ]);
    }

    async deletePlaylist(list: string) {
        const playlists = await this.savedPlaylists.getValue();

        const current = playlists.find((item) => item.list === list);

        if (!current) return;

        this.storage.delete('playlists', list);

        for (const code of current.videos) {
            if (playlists.find((item) => {
                if (item.list === list) return false;
                return !!item.videos.find((vod) => vod === code);
            })) {
                continue;
            }
            this.deleteSaved(code);
        }
    }
}
