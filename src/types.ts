import type { GrammarState, ThemedToken } from "shiki";

export interface ColorLoad {
    token: ThemedToken;
    range: Range;
}

export interface LoadLine {
    text: string;
    offset: number;
    lastGrammarState: GrammarState | undefined;
    loads: ColorLoad[];
}
