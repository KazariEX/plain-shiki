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

    const texts = chars.join("\n");
    const startOffset = chars.slice(0, start).join("\n").length;
    const endOffset = chars.slice(0, end).join("\n").length;

    const left = [];
    for (let i = start - 1, it = endOffset - 1; i < end && it >= startOffset; i--) {
        const text = chars[i];

        const idx = texts.lastIndexOf(text, it);
        if (idx !== -1 && idx >= startOffset) {
            left.push(text);
            it = idx - 1;
        }
        else break;
    }

    const right = [];
    for (let i = end, it = startOffset; i >= start && it < endOffset; i++) {
        const text = chars[i];

        const idx = texts.indexOf(text, it);
        if (idx !== -1 && idx < endOffset) {
            right.push(text);
            it = idx + 1;
        }
        else break;
    }

    return [start - left.length, end + right.length] as const;
}