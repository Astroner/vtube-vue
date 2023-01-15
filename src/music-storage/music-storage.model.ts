export type SavedVideo = {
    title: string,
    thumbnail: Blob,
    code: string,
}

export type SavedPlaylist = {
    list: string,
    title: string,
    thumbnail: Blob,
    videos: string[],
}

export type SaveQueueItem = {
    status: "WAITING" | "DOWNLOADING",
    code: string,
}
