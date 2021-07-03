export default function assignGraphTheoreticalDistances(graph) {
  let distances = [];
  let maxDistance = -Infinity;
  let count = graph.getNodeCount();

  graph.forEachNode(node => {
    if (!node.data) node.data = {};
    node.data.vec = {
      id: node.id,
      d: computeDistancesFrom(node.id)
    }
  });

  return getDistance;

  function getDistance(from, to) {
    if (Array.isArray(from)) {
      // Special case where they want to know largest distance
      return maxDistance;
    }

    let d = from.d.get(to.id);
    if (!Number.isFinite(d)) throw new Error('Something is wrong with the distance');
    return d;
  }

  function computeDistancesFrom(fromId) {
    let distances = new Map();
    let q = [{id: fromId, d: 0}]
    while (q.length) {
      let next = q.shift();
      distances.set(next.id, next.d);
      if (next.d > maxDistance) maxDistance = next.d;

      graph.forEachLinkedNode(next.id, other => {
        if (distances.has(other.id)) return;
        q.push({id: other.id, d: next.d + 1});
      });
    }

    return distances;
  }
}