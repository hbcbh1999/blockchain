const verify = require('../verify');

describe("Verify", () => {
  it("should say is valid on empty chain", () => {
    expect(verify.isBlockchainValid([])).toBe(true);
  });
});
