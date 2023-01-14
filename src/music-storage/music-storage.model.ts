export type SavedVideo = {
    title: string,
    thumbnail: Blob,
    code: string,
}

export type SavedPlaylist = {
    list: string,
    title: string,
    thumbnail: Blob,
}

export type SavedPlaylistVideoRelationship = {
    playlist: string,
    code: string,
}

export type SaveQueueItem = {
    status: "WAITING" | "DOWNLOADING",
    code: string,
}
