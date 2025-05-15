import type { GrammarState } from "shiki";

export interface LoadLine {
    text: string;
    offset: number;
    lastGrammarState: GrammarState | undefined;
    ranges: Range[];
    info: ColorInfo[];
}

export interface ColorInfo {
    range: Range;
    color: string;
    theme: string;
    name: string;
}
