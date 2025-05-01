import { expect, it } from "vitest";
import { diff } from "../src/diff";

it("add 1 line has different content with adjacent", () => {
    expect(diffWith(
        ["A", "B", "C"],
        ["D", "A", "B", "C"]
    //   |^|
    )).toEqual([0, 1]);

    expect(diffWith(
        ["A", "B", "C"],
        ["A", "D", "B", "C"]
    //        |^|
    )).toEqual([1, 2]);

    expect(diffWith(
        ["A", "B", "C"],
        ["A", "B", "C", "D"]
    //                  |^|
    )).toEqual([3, 4]);
});

it("add 1 line has same content as adjacent", () => {
    expect(diffWith(
        ["A", "B", "C"],
        ["A", "A", "B", "C"]
    //   |^|  |^|
    )).toEqual([0, 2]);

    expect(diffWith(
        ["A", "B", "C"],
        ["A", "B", "B", "C"]
    //        |^|  |^|
    )).toEqual([1, 3]);

    expect(diffWith(
        ["A", "B", "C"],
        ["A", "B", "C", "C"]
    //             |^|  |^|
    )).toEqual([2, 4]);
});

it("add N lines have discontinuous sequential subset in adjacent", () => {
    expect(diffWith(
        ["A", "B", "C"],
        ["A", "B", "B", "B", "C"]
    //         ^   |^|   ^
    )).toEqual([1, 4]);

    expect(diffWith(
        ["A", "B", "C"],
        ["A", "B", "A", "B", "C"]
    //    ^   |^|  |^|   ^
    )).toEqual([0, 4]);

    expect(diffWith(
        ["A", "B", "C"],
        ["A", "B", "C", "A", "B", "C"]
    //    ^    ^   |^|  |^|   ^    ^
    )).toEqual([0, 6]);

    expect(diffWith(
        ["A", "B", "C", "D"],
        ["A", "B", "A", "C", "B", "D", "C", "D"]
    //    ^    ^   |^|   ^    ^   |^|   ^    ^
    )).toEqual([0, 8]);

    expect(diffWith(
        ["A", "B", "C"],
        ["A", "B", "CA", "B", "C"]
    //    ^    ^   |^^|   ^    ^
    )).toEqual([0, 5]);

    expect(diffWith(
        ["A", "B", "C", "D"],
        ["A", "B", "CA", "DB", "C", "D"]
    //    ^    ^   |^^|  |^^|   ^    ^
    )).toEqual([0, 6]);
});

function diffWith(oldChars: string[], newChars: string[]) {
    return diff(newChars, oldChars.map((char) => ({
        text: char,
        loads: []
    })));
}