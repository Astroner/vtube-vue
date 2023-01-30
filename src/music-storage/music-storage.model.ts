export type SavedVideo = {
    title: string,
    thumbnail: Blob,
    code: string,
}

export type SavedPlaylistV1 = {
    list: string,
    title: string,
    thumbnail: Blob,
    videos: string[],
}

export type SavedPlaylistV2 = {
    list: string,
    title: string,
    thumbnail: Blob,
}

export type SaveQueueItem = {
    status: "WAITING" | "DOWNLOADING",
    code: string,
}

export type PlaylistDiff = {
    list: string;
    removed?: boolean;
    diff: Array<
        | { type: "ADD", code: string }
        | { type: "DEL", code: string }
    >
};

export type PlaylistAudio = {
    list: string;
    code: string;
}
