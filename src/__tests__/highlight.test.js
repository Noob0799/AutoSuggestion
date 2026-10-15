import { getHighlightParts } from "../utils/highlight";

describe("getHighlightParts", () => {
  it("returns the whole text when query is empty", () => {
    expect(getHighlightParts("Pizza", "  ")).toEqual([{ text: "Pizza", match: false }]);
  });

  it("highlights every case-insensitive match and keeps original casing", () => {
    expect(getHighlightParts("Pizza Pasta", "pa")).toEqual([
      { text: "Pizza ", match: false },
      { text: "Pa", match: true },
      { text: "sta", match: false },
    ]);
  });

  it("is safe with regex special characters", () => {
    expect(() => getHighlightParts("a (b) * c", "(")).not.toThrow();
    expect(getHighlightParts("a (b)", "(")[1]).toEqual({ text: "(", match: true });
  });
});
