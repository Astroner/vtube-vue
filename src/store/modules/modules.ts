import { YTImage } from "@/Responses";

export interface QueueItem {
  title: string,
  display: YTImage[],
  code: string,
}

export interface QueueState {
  items: QueueItem[]
  cursor: number;
  isLoading: boolean;
  currentRequestId: number;
}

export interface User {
  psid: string | null
}

export interface PlaylistData {
  id: string,
  title: string,
  display: YTImage[],
}

export interface Playlists {
  items: PlaylistData[]
}

export interface Modules {
  queue: QueueState;
  user: User;
  playlists: Playlists;
}
