export function throttle<T extends unknown[]>(func: (...args: T) => void, delay: number) {
    let start: number;
    let timer: NodeJS.Timeout | undefined = void 0;
    return function(this: unknown, ...args: T) {
        if (!timer) {
            start = performance.now();
            func.apply(this, args);
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
            timer = void 0;
        }, delay - (performance.now() - start) / 1000);
    };
}

export function once<T extends unknown[]>(func: (...args: T) => void) {
    let called = false;
    return function(this: unknown, ...args: T) {
        if (called) {
            return false;
        }
        called = true;
        func.apply(this, args);
        return true;
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