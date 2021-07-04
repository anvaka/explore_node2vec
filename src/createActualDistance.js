export default function createActualDistance(graph) {
  let maxDistance = -Infinity;
  let count = graph.getNodeCount();
  const nodeDistanceLookup = new Map();

  graph.forEachNode(node => {
    nodeDistanceLookup.set(node, computeDistancesFrom(node));
  });

  return getDistance;

  function getDistance(from, to) {
    let d = nodeDistanceLookup.get(from).get(to);
    if (!Number.isFinite(d)) throw new Error('Something is wrong with the distance');
    return d;
  }

  function computeDistancesFrom(from) {
    let distances = new Map();
    let q = [{node: from, d: 0}]
    while (q.length) {
      let next = q.shift();
      distances.set(next.node, next.d);
      if (next.d > maxDistance) maxDistance = next.d;

      graph.forEachLinkedNode(next.node.id, other => {
        if (distances.has(other)) return;
        q.push({node: other, d: next.d + 1});
      });
    }

    return distances;
  }
}