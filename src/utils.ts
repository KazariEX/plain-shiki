export function throttle<T extends unknown[]>(func: (...args: T) => void, delay: number) {
    let start = 0;
    let timer: NodeJS.Timeout | undefined;
    return function(this: unknown, ...args: T) {
        if (timer) {
            clearTimeout(timer);
            timer = void 0;
        }
        const now = performance.now();
        if (!start || now - start >= delay) {
            func.apply(this, args);
            start = now;
        }
        else {
            timer = setTimeout(() => {
                func.apply(this, args);
                start = performance.now();
                timer = void 0;
            }, delay + start - now);
        }
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
