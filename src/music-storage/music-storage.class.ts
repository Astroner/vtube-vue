import { DBObservable } from "@dogonis/db";
import { storage } from "./db-model";
import { DownloadQueue } from "./download-queue.class";
import { fetchPlaylist } from "./fetch-playlist";
import { getPlaylistsDiff } from "./get-playlists-diff";

export class MusicStorage {
    public downloadQueue = new DownloadQueue(2);

    public savedPlaylists = new DBObservable(storage, "playlists");

    public queue = new DBObservable(storage, "queue");

    // TODO: delete this observable coz it costs tooo much
    public all = new DBObservable(storage, "all");

    constructor() {
        this.downloadQueue.onDownloadCompleted = async (audio) => {
            await Promise.all([
                storage.put("all", audio.code, {
                    code: audio.code,
                    thumbnail: audio.thumbnail,
                    title: audio.title,
                }),
                storage.put("audios", audio.code, audio.audio),
                storage.delete("queue", audio.code),
            ]);
        };
        this.downloadQueue.onDownloadFailure = (code, error) => {
            if (error.response?.status === 404) {
                storage.delete("queue", code);
            } else {
                this.downloadQueue.add(code);
            }
        };

        storage.getAll("queue")
            .then((queue) => queue.forEach((item) => this.downloadQueue.add(item)));
    }

    getPlaylist(list: string) {
        return storage.get("playlists", list);
    }

    async getPlaylistAudios(list: string) {
        const entries = await storage.getAllBy("playlistAudios", "list", list);

        return entries.map((entry) => entry.value.code);
    }

    async savePlaylist(list: string) {
        const playlist = await fetchPlaylist(list);

        storage.add("playlists", playlist.list, {
            list: playlist.list,
            thumbnail: playlist.thumbnail,
            title: playlist.title,
        });

        for (const code of playlist.videos) {
            storage.add("playlistAudios", null, { code, list });
        }

        for (const video of playlist.videos) {
            this.saveAudio(video);
        }
    }

    async saveAudio(code: string) {
        if (await this.isAudioDownloaded(code)) return;

        await storage.put("queue", code, code);

        this.downloadQueue.add(code);
    }

    async getAllSaved() {
        return this.all.getValue();
    }

    async getAudio(code: string) {
        return storage.get("audios", code);
    }

    async getSavedInfo(code: string) {
        return storage.get("all", code);
    }

    async isAudioDownloaded(code: string) {
        return storage.has("all", code);
    }

    async deleteSaved(code: string) {
        return Promise.all([
            storage.delete("all", code),
            storage.delete("audios", code),
        ]);
    }

    async deleteAllSaved() {
        return Promise.all([
            storage.clear("all"),
            storage.clear("audios"),
            storage.clear("playlists"),
        ]);
    }

    async deletePlaylist(list: string) {
        const audios = await this.getPlaylistAudios(list);

        await Promise.all(
            [storage.delete("playlists", list)]
                .concat(
                    audios.map(
                        (code) => this.deleteFromPlaylist(list, code),
                    ),
                ),
        );
    }

    async addToPlaylist(list: string, code: string) {
        const entries = await storage.getAllBy("playlistAudios", "code", code);
        if (entries.find((entry) => entry.value.list === list)) return;
        
        await storage.add("playlistAudios", null, { list, code });

        await this.saveAudio(code);
    }

    async deleteFromPlaylist(list: string, code: string) {
        const playlistsWithAudio = await storage.getAllBy("playlistAudios", "code", code);

        const playlistAudioEntry = playlistsWithAudio.find((item) => item.value.list === list);

        if (!playlistAudioEntry) return;

        if (playlistsWithAudio.length === 1 && playlistsWithAudio[0].value.list === list) {
            this.deleteSaved(code);
        }

        storage.delete("playlistAudios", playlistAudioEntry.key);
    }

    async updateSavedPlaylists() {
        const diff = await getPlaylistsDiff();

        await Promise.all(diff.map((playlist) => {
            if (playlist.removed) return this.deletePlaylist(playlist.list);
            return Promise.all(playlist.diff.map((item) => {
                if (item.type === "ADD") return this.addToPlaylist(playlist.list, item.code);
                return this.deleteFromPlaylist(playlist.list, item.code);
            }));
        }));

        return diff;
    }
}
