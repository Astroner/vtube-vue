import { AxiosError } from "axios";
import { fetchAudio, FetchedAudio } from "./fetch-audio";

export class Loader {
    status: "BUSY" | "FREE" = "FREE"

    onComplete?: (audio: FetchedAudio) => void;

    onError?: (code: string, error: AxiosError) => void;

    async start(code: string) {
        if (this.status !== "FREE") return;
        this.status = "BUSY";
        try {
            const audio = await fetchAudio(code);
            this.status = "FREE";
            if (this.onComplete) this.onComplete(audio);
        } catch (e) {
            this.status = "FREE";
            if (this.onError) this.onError(code, e as AxiosError);
        }
    }
}
