import { env } from "@/env";
import eruda from "eruda";

const isInitiated = env.NODE_ENV === "development";

let status = env.NODE_ENV === "development";

export const isShown = () => status;

if (env.NODE_ENV === "development") {
    eruda.init();
}

export const show = () => {
    if (status) return;
    if (!isInitiated) {
        eruda.init();
    } else {
        eruda.show();
    }
    status = true;
};

export const hide = () => {
    if (!status) return;
    eruda.hide();
    status = false;
};
