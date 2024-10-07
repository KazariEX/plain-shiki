export function debounce<T extends unknown[]>(func: (...args: T) => void, {
    delay = 1500
} = {}) {
    let timer: NodeJS.Timeout | undefined = void 0;
    return function(this: unknown, ...args: T) {
        !timer && func.apply(this, args);
        timer = setTimeout(() => {
            timer = void 0;
        }, delay);
    };
}

export function isArrayEqual(a: unknown[], b: unknown[]) {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}