import { getPlaylist } from "@/api/main/playlists";
import { AxiosError } from "axios";
import { storage } from "./db-model";
import { PlaylistDiff } from "./music-storage.model";

export const getPlaylistsDiff = async () => {
    const saves = await storage.getAll("playlists");

    const diffs = await Promise.all(saves.map(async (saved): Promise<PlaylistDiff> => {
        try {
            const savedVideos = await storage.getAllBy("playlistAudios", "list", saved.list);
            const info = await getPlaylist(saved.list);
            const videosMap = new Map(info.list.map((item) => [item.code, item.code]));

            const diff = new Array<{ type: "DEL" | "ADD", code: string }>();

            for (const { value: { code } } of savedVideos) {
                if (videosMap.has(code)) {
                    videosMap.delete(code);
                } else {
                    diff.push({
                        type: "DEL",
                        code,
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

    return diffs.filter((status) => status.removed || status.diff.length > 0);
};
