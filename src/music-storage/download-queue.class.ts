import { onlineObservable } from "@/helpers/online-observable";
import { AxiosError } from "axios";
import { FetchedAudio } from "./fetch-audio";
import { Loader } from "./loader.class";
import { SaveQueueItem } from "./music-storage.model";

export class DownloadQueue {
    onDownloadCompleted?: (audio: FetchedAudio) => (void | Promise<void>);
    
    onDownloadFailure?: (code: string, error: AxiosError) => void;

    private queue: Map<string, SaveQueueItem>;

    private loaders: Loader[];

    private subs = new Array<(items: SaveQueueItem[]) => void>();

    constructor(
        parallelDownloads: number,
        initialQueue: string[] = [],
    ) {
        this.queue = new Map(initialQueue.map((code) => [code, { code, status: "WAITING" }]));

        this.loaders = new Array(parallelDownloads).fill(0).map(() => {
            const loader = new Loader();
            loader.onComplete = (result) => this.onLoaderFinish(result);
            loader.onError = (code, error) => this.onLoaderFailure(code, error);

            return loader;
        });

        if (onlineObservable.getStatus()) this.loaders.forEach(() => this.checkForWork());

        onlineObservable.subscribe((isOnline) => {
            if (isOnline) {
                this.loaders.forEach(() => this.checkForWork());
            }
        });
    }

    add(code: string) {
        if (this.queue.has(code)) return;
        this.queue.set(code, { code, status: "WAITING" });
        this.checkForWork();
        this.update();
    }

    getQueueState() {
        return Array.from(this.queue.values());
    }

    subscribe(cb: (items: SaveQueueItem[]) => void) {
        this.subs.push(cb);
        return {
            unsubscribe: () => {
                this.subs.splice(this.subs.indexOf(cb), 1);
            },
        };
    }

    private async onLoaderFinish(result: FetchedAudio) {
        if (this.onDownloadCompleted) {
            const res = this.onDownloadCompleted(result);
            if (res instanceof Promise) {
                await res;
            }
        }
        this.queue.delete(result.code);
        this.checkForWork();
        this.update();
    }

    private onLoaderFailure(code: string, error: AxiosError) {
        if (error.code !== "ERR_NETWORK") {
            this.queue.delete(code);
            this.checkForWork();
            if (this.onDownloadFailure) this.onDownloadFailure(code, error);
            this.update();
        } else {
            const item = this.queue.get(code);
            if (!item) return;
            item.status = "WAITING";
        }
    }

    private checkForWork() {
        for (const item of this.queue.values()) {
            if (item.status === "WAITING") {
                const loader = this.loaders.find((l) => l.status === "FREE");
                if (loader) {
                    item.status = "DOWNLOADING";
                    loader.start(item.code);
                }
                break;
            }
        }
    }

    private update() {
        const value = this.getQueueState();
        for (const cb of this.subs) {
            cb(value);
        }
    }
}
