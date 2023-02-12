export const debounce = <Args extends any[]>(func: (...args: Args) => void, wait: number) => {
    let timeout: number | undefined;
    
    return (...args: Args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            timeout = undefined;
            func(...args);
        }, wait);
    };
};
