export function diff(
    textLines: string | string[],
    dataLines: string | unknown[],
    getText?: (index: number) => string,
    addition?: (index: number) => boolean
) {
    let i = 0;
    for (; i < textLines.length; i++) {
        const text = getText?.(i) ?? dataLines[i];
        if (textLines[i] !== text || addition?.(i)) {
            break;
        }
    }

    let j = textLines.length - 1;
    let k = dataLines.length - 1;
    for (; j >= 0 && k >= 0; j--, k--) {
        const text = getText?.(k) ?? dataLines[k];
        if (textLines[j] !== text || addition?.(k)) {
            break;
        }
    }
    j = textLines.length > dataLines.length ? j : k;

    if (i > j) {
        [i, j] = [j, i];
    }
    i = Math.max(0, i);
    j = Math.min(textLines.length - 1, j) + 1;

    if (textLines.length === dataLines.length && i + 1 === j) {
        return [i, j];
    }
    return expand([...textLines], i, j);
}

function expand(chars: string[], start: number, end: number) {
    const side = matchTwoSides(Math.max(0, start + end - chars.length));
    start -= side;
    end += side;

    function matchTwoSides(offset: number) {
        const pos = chars.slice(0, start).indexOf(chars[end], offset);

        if (pos === -1) {
            return 0;
        }
        for (let j = pos, k = end; j < start - 1; k++, j++) {
            if (chars[j + 1] !== chars[k + 1]) {
                return matchTwoSides(offset + 1);
            }
        }
        return start - pos;
    }

    const inner = new Set(chars.slice(start, end));

    const left = [];
    for (let i = start - 1, it = end - 1; inner.has(chars[i]); i--, it--) {
        const text = chars[i];

        for (; it >= start; it--) {
            if (chars[it] === text) {
                break;
            }
        }
        if (it >= start) {
            left.push(text);
        }
    }

    const right = [];
    for (let i = end, it = start; inner.has(chars[i]); i++, it++) {
        const text = chars[i];

        for (; it < end; it++) {
            if (chars[it] === text) {
                break;
            }
        }
        if (it < end) {
            right.push(text);
        }
    }

    return [start - left.length, end + right.length] as const;
}