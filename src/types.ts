import type { GrammarState, ThemedToken } from "shiki";

export interface LoadLine {
    text: string;
    offset: number;
    lastGrammarState: GrammarState | undefined;
    loads: ColorLoad[];
    info: ColorInfo[];
}

export interface ColorLoad {
    token: ThemedToken;
    range: Range;
}

export interface ColorInfo {
    range: Range;
    color: string;
    theme: string;
    name: string;
}
