import { Session, YTImage } from "@dogonis/vtube-client";

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
  session: Session | null,
  info: null | {
    username: string,
  }
}

export interface Modules {
  queue: QueueState;
  user: User;
}
