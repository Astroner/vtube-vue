import { getPlaylist } from "@/api/main/playlists";
import { DBObservable } from "@/helpers/db/db-observable.class";
import { AxiosError } from "axios";
import { storage } from "./db-model";
import { DownloadQueue } from "./download-queue.class";
import { fetchPlaylist } from "./fetch-playlist";
import { PlaylistDiff } from "./music-storage.model";

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

    // getPlaylistAudios(list: string) {
    //     return storage.findAll("playlistAudios", ({ value }) => value.list === list);
    // }

    async savePlaylist(list: string) {
        const playlist = await fetchPlaylist(list);

        storage.put("playlists", playlist.list, playlist);

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
            storage.deleteAll("all"),
            storage.deleteAll("audios"),
            storage.deleteAll("playlists"),
        ]);
    }

    async deletePlaylist(list: string) {
        const playlists = await this.savedPlaylists.getValue();

        const current = playlists.find((item) => item.list === list);

        if (!current) return;

        storage.delete('playlists', list);

        for (const code of current.videos) {
            const includedInAnotherPlaylist = playlists.find((item) => item.list === list 
                ? false 
                : !!item.videos.find((vod) => vod === code));

            if (includedInAnotherPlaylist) {
                continue;
            }
            this.deleteSaved(code);
        }
    }

    async deleteFromPlaylist(code: string, list: string) {
        const playlists = await this.savedPlaylists.getValue();

        const current = playlists.find((item) => item.list === list);

        if (!current || !current.videos.includes(code)) return;

        const includedInAnotherPlaylist = playlists.find((item) => item.list === list 
                ? false 
                : !!item.videos.find((vod) => vod === code));

        if (!includedInAnotherPlaylist) this.deleteSaved(code);
    }

    async updateSavedPlaylists() {
        const saves = await this.savedPlaylists.getValue();

        const diffs = await Promise.all(saves.map(async (saved): Promise<PlaylistDiff> => {
            try {
                const info = await getPlaylist(saved.list);
                const videosMap = new Map(info.list.map((item) => [item.code, item.code]));
    
                const diff = new Array<{ type: "DEL" | "ADD", code: string }>();
    
                for (const item of saved.videos) {
                    if (videosMap.has(item)) {
                        videosMap.delete(item);
                    } else {
                        diff.push({
                            type: "DEL",
                            code: item,
                        });
                    }
                }
    
                for (const code of videosMap.keys()) {
                    diff.push({
                        type: "ADD",
                        code,
                    });
                }
    
                return {
                    list: saved.list,
                    diff,
                    removed: false,
                };
            } catch (e: any) {
                if (e.isAxiosError) {
                    const error: AxiosError = e;

                    if (error.response?.status === 404) {
                        return {
                            list: saved.list,
                            diff: [],
                            removed: true,
                        };
                    }
                }
                throw e;
            }
        }));

        return diffs;
    }
}
