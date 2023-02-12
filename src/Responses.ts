export type Page<T> = {
    items: T[];
    next: null | {
        key: string;
    };
};

export type Category<T> = {
    title: string;
    items: T[];
};

export type YTImage = {
    url: string;
    width: number;
    height: number;
};

export type YTVideo = {
    code: string;
    title: string;
    display: YTImage[];
};

export type YTPlaylist = {
    title: string;
    display: YTImage[];
    list: Page<YTVideo>;
};

export type YTPlaylistWithID = {
    list: string;
    title: string;
    display: YTImage[];
};

export type ChannelPreview = {
    id: string;
    title: string;
    description: string | null;
    tag: string | null;
    display: YTImage[];
};

export type YoutubeChannel = {
    id: string;
    title: string;
    description: string | null;
    avatar: YTImage[];
    background: YTImage[];
    tags: string[];
};

export type MusicChannel = {
    id: string;
    title: string;
    description: string | null;
    background: YTImage[];
    categories: Category<ChannelPreview | YTVideo | YTPlaylistWithID>[];
};

export type VideoFormat = {
    itag: number;
    mime: string;
    quality: string;
    contentLength: number;
};

export type SearchEntryBase<K extends string, T> = {
    type: K;
    value: T;
};

export type ChannelSearchEntry = SearchEntryBase<"CHANNEL", ChannelPreview>;

export type VideoSearchEntry = SearchEntryBase<"VIDEO", YTVideo>;

export type PlaylistSearchEntry = SearchEntryBase<"PLAYLIST", YTPlaylistWithID>;

export type DynamicPlaylistSearchEntry = SearchEntryBase<
    "DYNAMIC_PLAYLIST",
    YTPlaylistWithID & { code: string }
>;

export type CollectionSearchEntry = SearchEntryBase<
    "COLLECTION",
    Category<
        | ChannelSearchEntry
        | VideoSearchEntry
        | PlaylistSearchEntry
        | DynamicPlaylistSearchEntry
    >
>;

export type SearchEntry =
    | ChannelSearchEntry
    | VideoSearchEntry
    | CollectionSearchEntry
    | PlaylistSearchEntry
    | DynamicPlaylistSearchEntry;

export type RecommendationBase<K extends string, T> = {
    type: K;
    value: T;
};

export type Recommendation =
    | RecommendationBase<"VIDEO", YTVideo>
    | RecommendationBase<
          "DYNAMIC_PLAYLIST",
          YTPlaylistWithID & { code: string }
      >;

export type MusicCategory = Category<Recommendation>;

export interface MusicCategories {
    categories: MusicCategory[];
}
