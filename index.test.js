const { makeChange } = require("./makeChange");

describe("makeChange", () => {
  it("calculates change for single number", () => {
    expect(makeChange(7, [1])).toEqual(expect.arrayContaining([{ 1: 7 }]));
  });

  it("calculates change for a few numbers", () => {
    expect(makeChange(7, [2, 5])).toEqual(
      expect.arrayContaining([{ 2: 1, 5: 1 }])
    );
  });

  it("calculates change if coins have to be summed >1 times", () => {
    expect(makeChange(30, [4, 9])).toEqual(
      expect.arrayContaining([{ 4: 3, 9: 2 }])
    );
  });

  it("calculates change for a lot of numbers", () => {
    expect(makeChange(19, [1, 2, 4, 8])).toEqual(
      expect.arrayContaining([
        { 1: 19 },
        { 1: 17, 2: 1 },
        { 1: 15, 4: 1 },
        { 1: 11, 8: 1 },
        // { 1: 1, 2: 3, 4: 1, 8: 1 },
      ])
    );
  });

  it("does not include results to be intermediately dropped", () => {
    expect(makeChange(19, [1, 4, 8])).not.toEqual(
      expect.arrayContaining([{ 4: 1, 8: 1 }])
    );
  });

  it("combines different variants", () => {
    expect(makeChange(7, [1, 5])).toEqual(
      expect.arrayContaining([{ 1: 7 }, { 1: 2, 5: 1 }])
    );
  });

  it("throws an error if coinset is empty", () => {
    expect(() => makeChange(7, [])).toThrow();
  });

  it("throws an error if change cant be calculated", () => {
    expect(() => makeChange(7, [3, 8])).toThrow();
  });
});

const testCases = [
  {
    x: 6,
    coinset: [1, 5, 10, 25],
    expected: [{ 1: 6 }, { 1: 1, 5: 1 }],
  },
  {
    x: 6,
    coinset: [3, 4],
    expected: [{ 3: 2 }],
  },
  {
    x: 6,
    coinset: [1, 3, 4],
    expected: [{ 1: 6 }, { 3: 2 }, { 1: 3, 3: 1 }, { 1: 2, 4: 1 }],
  },
  {
    x: 6,
    coinset: [5, 7],
    expected: "error",
  },
];

testCases.forEach((testCase) => {
  const { x, coinset, expected } = testCase;
  const expectedStr = JSON.stringify(expected);
  const coinsetStr = coinset.join(", ");
  test(`Returns ${expectedStr} if x is ${x} for ${coinsetStr}`, () => {
    if (expected === "error") {
      expect(() => makeChange(x, coinset)).toThrow();
    } else {
      expect(makeChange(x, coinset)).toEqual(expect.arrayContaining(expected));
    }
  });
});
