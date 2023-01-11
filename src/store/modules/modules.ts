import { YTImage } from "@/Responses";

export interface QueueItem {
  title: string,
  display: YTImage[],
  code: string,
  saved?: {
    thumbnail: Blob,
  }
}

export interface QueueState {
  items: QueueItem[]
  cursor: number;
  isLoading: boolean;
  currentRequestId: number;
  currentPlaylist: string | null;
}

export interface User {
  token: string | null,
  info: null | {
    username: string,
  }
}

export interface Modules {
  queue: QueueState;
  user: User;
}
