const message = require('network/stream/message');

describe("Chain Partial", () => {
  let m = null;
  let chainPartial = null;
  let isBlockchainValid = null;
  let verify = require('blockchain/chain/verify');

  beforeEach(() => {
    isBlockchainValid = verify.isBlockchainValid;
    verify.isBlockchainValid = () => true;

    chainPartial = require('../../chain/partial')
  });

  afterEach(() => {
    verify.isBlockchainValid = isBlockchainValid;
  });

  beforeEach(() =>{
    m = {stream: message(), chain: []};
  });

  it("should update with a new chain an empty", (done) => {

    m.stream.on('chain.update.skip', () => { fail(); done(); });
    m.stream.on('chain.update.invalid', () => { fail(); done(); });
    m.stream.on('chain.update', (chain) => {
      expect(chain).toEqual([{index: 1}, {index: 2}]);
      done();
    });

    m.chain = [];
    chainPartial(m)([{index: 1}, {index: 2}]);
  });

  it("should update with a new chain", (done) => {

    m.stream.on('chain.update.skip', () => { fail(); done(); });
    m.stream.on('chain.update.invalid', () => { fail(); done(); });
    m.stream.on('chain.update', (chain) => {
      expect(chain).toEqual([{index: 1}, {index: 2}, {index: 3}]);
      done();
    });

    m.chain = [{index: 1}, {index: 2}];
    chainPartial(m)([{index: 1}, {index: 2}, {index: 3}]);
  });

  it("should update with a new chain of 2 heads", (done) => {

    m.stream.on('chain.update.skip', () => { fail(); done(); });
    m.stream.on('chain.update.invalid', () => { fail(); done(); });
    m.stream.on('chain.update', (chain) => {
      expect(chain).toEqual([{index: 1}, {index: 2}, {index: 3, data: "LATEST"}]);
      done();
    });

    m.chain = [{index: 1}, {index: 2}, {index: 3, data: "MY VERSION"}];
    chainPartial(m)([{index: 1}, {index: 2}, {index: 3, data: "LATEST"}]);
  });

  it("should not update with a shorter chain", (done) => {

    m.stream.on('chain.update.skip', (chain) => {
      expect(chain).toEqual([{index: 1}, {index: 2}, {index: 3}, {index: 4}]);
      expect(m.chain).toEqual([{index: 1}, {index: 2}, {index: 3}, {index: 4}]);
      done();
    });
    m.stream.on('chain.update.invalid', () => { fail(); done(); });
    m.stream.on('chain.update', () => { fail(); done(); });

    m.chain = [{index: 1}, {index: 2}, {index: 3}, {index: 4}];
    chainPartial(m)([{index: 1}, {index: 2}, {index: 3, data: "LATEST"}]);
  });
});
