export interface YTImage {
    url: string;
    width: number;
    height: number;
}

export interface VideoRecommendation {
    type: "VIDEO";
    title: string;
    display: YTImage[];
    code: string;
}

export interface DynamicPlaylistRecommendation {
    type: "DYNAMIC_PLAYLIST";
    title: string;
    display: YTImage[];
    list: string;
    code: string;
}

export type Recommendation =
    | VideoRecommendation
    | DynamicPlaylistRecommendation;

export interface MusicCategory {
    title: string;
    items: Recommendation[];
}

export interface MusicCategories {
    categories: MusicCategory[];
}

export interface MediaFormat {
    itag: number,
    mime: string,
    quality: string,
}

export interface MediaInfo {
    title: string,
    displayImage: YTImage[],
}

export interface ListItem {
    title: string;
    code: string;
    display: YTImage[];
}
export interface Playlist {
    title: string;
    display: YTImage[];
    list: ListItem[];
}
