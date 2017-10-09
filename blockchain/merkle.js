const add = (hash, tree, data) => {
  let block = {data, hash: hash(JSON.stringify(data))};

  let nodes = leafs(tree).filter((item) => (item) ? true : false).concat([block]);

  if (nodes.length === 1) {
    return nodes;
  }

  let baseNodes = Math.pow(2, Math.ceil(Math.log(nodes.length) / Math.log(2)));

  nodes = nodes.concat(Array.apply(null, new Array(baseNodes)).map(() => '')).slice(0, baseNodes);

  for (let j=0; nodes.slice(j).length > 1; j+=2) {
    let blocks = nodes.slice(j, j+2).map((block) => (block instanceof Object) ? block.hash : block);
    nodes = nodes.concat(hash(blocks.join('')));
  }

  return nodes;
};

const leafs = (tree) => {
  return tree.slice(0, Math.pow(2, height(tree)-1));
};

const height = (tree) => {
  let rem = tree.length, height = 0;

  while (rem >= 1) {
    ++height;
    rem /= 2;
  }

  return height;
};

module.exports = {
  height,
  leafs,
  add,
};
