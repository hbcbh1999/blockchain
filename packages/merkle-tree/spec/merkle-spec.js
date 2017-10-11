const {height, leafs, add, clean, top, validate, remove} = require('../');

describe("Merkle Tree", () => {
  it("should compute the tree height", () => {
    expect(height([])).toBe(0);
  });

  it("should compute the tree height of one leaf", () => {
    expect(height([1])).toBe(1);
  });

  it("should compute the tree height of two leafs and root node", () => {
    expect(height([1, 2, 1])).toBe(2);
  });

  it("should compute the tree height of a complex tree", () => {
    expect(height([
      1, 1, 1, 1,
      1, 1,
      1
    ])).toBe(3);
  });

  it("should compute the tree height of a deeper tree", () => {
    expect(height([
      1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1,
      1, 1,
      1
    ])).toBe(4);
  });

  it("should compute how many leafs we have", () => {
    let first = leafs([
      2, 2, 2, 2, 2, 2, 2, 2,
      1, 1, 1, 1,
      1, 1,
      1
    ]);
    expect(first.length).toBe(8);
    expect(first.filter((item) => (item === 2) ? true : false).length).toBe(8);
  });

  it("should add a single node", () => {
    let tree = add(() => 'hash', [], 'any data');

    expect(tree).toEqual([{hash:'hash', data: 'any data'}]);
  });

  it("should add a second node", () => {
    let tree = add(() => 'hash', [{hash:'hash', data: 'any data'}], 'any data');

    expect(tree).toEqual([
      {hash:'hash', data: 'any data'},{hash:'hash', data: 'any data'},
      'hash'
    ]);
  });

  it("should add a fourth node", () => {
    let tree = add(
      () => 'hash',
      [
        {hash:'hash', data: 'any data'},{hash:'hash', data: 'any data'},{hash:'hash', data: 'any data'}, null,
        'hash', 'hash',
        'hash'
      ],
      'any data'
    );

    expect(tree).toEqual([
      {hash:'hash', data: 'any data'},{hash:'hash', data: 'any data'},{hash:'hash', data: 'any data'}, {hash:'hash', data: 'any data'},
      'hash', 'hash',
      'hash'
    ]);
  });

  it("should add a third node", () => {
    let tree = add(
      () => 'hash',
      [
        {hash:'hash', data: 'any data'},{hash:'hash', data: 'any data'},
        'hash'
      ],
      'any data'
    );

    expect(tree).toEqual([
      {hash:'hash', data: 'any data'},{hash:'hash', data: 'any data'},{hash:'hash', data: 'any data'}, '',
      'hash', 'hash',
      'hash'
    ]);
  });

  it("should drop the merkle tree", () => {
    let tree = [
      {hash:'hash', data: 'any data'},{hash:'hash', data: 'any data'},{hash:'hash', data: 'any data'}, '',
      'hash', 'hash',
      'hash'
    ];

    expect(clean(tree)).toEqual(['any data','any data','any data']);
  });

  it("should drop the merkle tree without padding", () => {
    let tree = [
      {hash:'hash', data: 'any data'},{hash:'hash', data: 'any data'},{hash:'hash', data: 'any data'}, '',
      'hash', 'hash',
      'hash'
    ];

    expect(clean(tree, true)).toEqual(['any data','any data','any data', '']);
  });

  it("should expose the top hash", () => {
    let tree = [
      {hash:'hash', data: 'any data'},{hash:'hash', data: 'any data'},{hash:'hash', data: 'any data'}, '',
      'hash', 'hash',
      'top hash'
    ];

    expect(top(tree)).toEqual("top hash");
  });

  it("should validate a tree", () => {
    let l = parseInt(Math.random()*100) + 33;

    let tree = [];
    const hash = require('crypto-helpers').hash;

    for (let i=0; i<l; i++) {
      tree = add(hash, tree, "test_"+Math.random());
    }

    expect(validate(hash, tree)).toBe(true);
  });

  it("should remove an object", () => {
    let tree = [
      {hash:'hash', data: 'any data 1'},{hash:'hash', data: 'any data custom'},{hash:'hash', data: 'any data 2'}, '',
      'hash', 'hash',
      'top hash'
    ];

    tree = remove(() => 'hash', tree, (item) => (item != 'any data custom') ? true : false);

    expect(tree).toEqual([
      {hash:'hash', data: 'any data 1'},{hash:'hash', data: 'any data 2'},
      'hash'
    ]);
  });
});
