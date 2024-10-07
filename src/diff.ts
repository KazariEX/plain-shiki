import type { LoadLine } from "./types";

export function diff(textLines: string[], loadLines: LoadLine[]) {
    let i = 0;
    for (; i < textLines.length; i++) {
        if (textLines[i] !== loadLines[i]?.text) {
            break;
        }
        if (loadLines[i]?.loads.some(({ range }) => range.collapsed)) {
            break;
        }
    }

    let j = textLines.length - 1;
    let k = loadLines.length - 1;
    for (; j >= 0 && k >= 0; j--, k--) {
        if (textLines[j] !== loadLines[k]?.text) {
            break;
        }
        if (loadLines[k]?.loads.some(({ range }) => range.collapsed)) {
            break;
        }
    }

    if (i > j) {
        [i, j] = [j, i];
    }
    i = Math.max(0, i);
    j = Math.min(textLines.length - 1, j) + 1;

    if (textLines.length === loadLines.length && i + 1 === j) {
        return [i, j];
    }
    return [...expand(textLines, i, j)];
}

function* expand(textLines: string[], start: number, end: number) {
    const side = matchTwoSides(Math.max(0, start + end - textLines.length));
    start -= side;
    end += side;

    function matchTwoSides(offset: number) {
        const pos = textLines.slice(0, start).indexOf(textLines[end], offset);

        if (pos === -1) {
            return 0;
        }
        for (let j = pos, k = end; j < start - 1; k++, j++) {
            if (textLines[j + 1] !== textLines[k + 1]) {
                return matchTwoSides(offset + 1);
            }
        }
        return start - pos;
    }

    const inner = new Set(textLines.slice(start, end));

    const left = [];
    for (let i = start - 1, it = end - 1; inner.has(textLines[i]); i--, it--) {
        const text = textLines[i];

        for (; it >= start; it--) {
            if (textLines[it] === text) {
                break;
            }
        }
        if (it >= start) {
            left.push(text);
        }
    }
    yield start - left.length;

    const right = [];
    for (let i = end, it = start; inner.has(textLines[i]); i++, it++) {
        const text = textLines[i];

        for (; it < end; it++) {
            if (textLines[it] === text) {
                break;
            }
        }
        if (it < end) {
            right.push(text);
        }
    }
    yield end + right.length;
}