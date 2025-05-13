import type { LoadLine } from "./types";

export function diff(
    textLines: string[],
    loadLines: Pick<LoadLine, "text" | "loads">[],
) {
    let i = 0;
    for (; i < textLines.length; i++) {
        const { text, loads } = loadLines[i] ?? {};
        if (textLines[i] !== text || loads?.some(({ range }) => range.collapsed)) {
            break;
        }
    }

    let j = textLines.length - 1;
    let k = loadLines.length - 1;
    for (; j >= 0 && k >= 0; j--, k--) {
        const { text, loads } = loadLines[k] ?? {};
        if (textLines[j] !== text || loads?.some(({ range }) => range.collapsed)) {
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
    return expand(textLines, i, j);
}

function expand(lines: string[], start: number, end: number) {
    const side = matchTwoSides(Math.max(0, start + end - lines.length));
    start -= side;
    end += side;

    function matchTwoSides(offset: number) {
        const pos = lines.slice(0, start).indexOf(lines[end], offset);

        if (pos === -1) {
            return 0;
        }
        for (let j = pos, k = end; j < start - 1; k++, j++) {
            if (lines[j + 1] !== lines[k + 1]) {
                return matchTwoSides(offset + 1);
            }
        }
        return start - pos;
    }

    const texts = lines.join("\n");
    const startOffset = lines.slice(0, start).join("\n").length;
    const endOffset = lines.slice(0, end).join("\n").length;

    let left = 0;
    for (let i = start - 1, it = endOffset - 1; i < end && it >= startOffset; i--) {
        const text = lines[i];

        const idx = texts.lastIndexOf(text, it);
        if (idx !== -1 && idx >= startOffset) {
            left++;
            it = idx - 1;
        }
        else break;
    }

    let right = 0;
    for (let i = end, it = startOffset; i >= start && it < endOffset; i++) {
        const text = lines[i];

        const idx = texts.indexOf(text, it);
        if (idx !== -1 && idx < endOffset) {
            right++;
            it = idx + 1;
        }
        else break;
    }

    return [start - left, end + right] as const;
}
