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
  token: string | null,
  info: null | {
    username: string,
  }
}

export interface Modules {
  queue: QueueState;
  user: User;
}
