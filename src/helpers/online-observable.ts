class OnlineObservable {
    private status = navigator.onLine;

    private subs = new Array<(next: boolean) => void>();

    constructor() {
        window.addEventListener('online', () => {
            this.status = true;
            this.update();
        });
        window.addEventListener('offline', () => {
            this.status = false;
            this.update();
        });
    }

    getStatus() {
        return this.status;
    }

    subscribe(cb: ((next: boolean) => void)) {
        this.subs.push(cb);

        return {
            unsubscribe: () => {
                this.subs.splice(this.subs.indexOf(cb), 1);
            },
        };
    }

    private update() {
        for (const cb of this.subs) {
            cb(this.status);
        }
    }
}

export const onlineObservable = new OnlineObservable();
