import eruda from "eruda";

const isInitiated = false;

let status = false;

export const isShown = () => status;

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
