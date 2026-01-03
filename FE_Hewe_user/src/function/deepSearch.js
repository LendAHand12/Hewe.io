export const deepSearch = (tree, value, key) => {
  for (let i of tree) {
    const stack = [i];
    while (stack.length) {
      const node = stack.shift();
      if (node[key] == value) return node;
      node.array && stack.push(...node.array);
    }
  }
  return null;
};
