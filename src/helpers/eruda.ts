import { env } from "@/env";
import eruda from "eruda";

let status = env.NODE_ENV === "development";

export const isShown = () => status;

if (!status) {
    eruda.hide();
}

eruda.init();

export const show = () => {
    if (status) return;
    eruda.show();
    status = true;
};

export const hide = () => {
    if (!status) return;
    eruda.hide();
    status = false;
};
