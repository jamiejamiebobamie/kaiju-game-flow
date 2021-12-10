const utils = require("./utils");

// returnNumber
test("takes a num and returns 0 if NaN or a fallback if provided", () => {
  expect(utils.returnNumber(NaN)).toBe(0);
  expect(utils.returnNumber(NaN, 3)).toBe(3);
  expect(utils.returnNumber(3)).toBe(3);
  expect(utils.returnNumber(undefined)).toBe(0);
  expect(utils.returnNumber(null)).toBe(0);
  expect(utils.returnNumber(null, 42)).toBe(42);
});
// getRandomIntInRange
test("takes a min and a max num and returns an integer between them [min,max]", () => {
  let val = utils.getRandomIntInRange(1, 1);
  expect(val).toBeLessThan(2);
  expect(val).toBeGreaterThan(0);
  val = utils.getRandomIntInRange();
  expect(val).toBeLessThan(2);
  expect(val).toBeGreaterThan(-1);
  val = utils.getRandomIntInRange(3, 4);
  expect(val).toBeLessThan(5);
  expect(val).toBeGreaterThan(2);
});
// getTileXAndY
test("takes two indices i and j and a scale and returns an x and y coordinate", () => {
  const vals = Object.values(utils.PENINSULA_TILE_LOOKUP).map(({ i, j }) =>
    utils.getTileXAndY({ i, j, scale: 0.3 })
  );
  expect(
    vals.every(({ x, y }) => typeof x === typeof 42 && typeof y === typeof 42)
  ).toBe(true);
  expect(vals.every(({ x, y }) => x > 0 && x < 500 && y > 0 && y < 800)).toBe(
    true
  );
});
