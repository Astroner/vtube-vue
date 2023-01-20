import { env } from "@/env";
import eruda from "eruda";

let status = env.NODE_ENV === "development";

export const isShown = () => status;

if (env.NODE_ENV === "development") {
    eruda.init();
}

export const show = () => {
    if (status) return;
    eruda.init();
    status = true;
};

export const hide = () => {
    if (!status) return;
    eruda.destroy();
    status = false;
};
