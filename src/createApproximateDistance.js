export default function createApproximateDistance(graph, pivotNodes) {
  let maxDistance = -Infinity;
  let count = graph.getNodeCount();
  const nodeDistanceLookup = new Map();

  pivotNodes.forEach(node => {
    nodeDistanceLookup.set(node, computeDistancesFrom(node));
  });

  return getDistance;

  function getDistance(from, to) {
    let shortestSum = Infinity;
    let fromVec = [];
    pivotNodes.forEach(fromPivot => {
      fromVec.push(nodeDistanceLookup.get(fromPivot).get(from));
    });
    let toVec = [];
    pivotNodes.forEach(toPivot => {
      toVec.push(nodeDistanceLookup.get(toPivot).get(to));
    });
    // let d = getVecDistance(fromVec, toVec);
    let d = getDeltaDistance(fromVec, toVec);
    return d;

    // pivotNodes.forEach(fromPivot => {
    //   let fromPivotNodeToFrom = nodeDistanceLookup.get(fromPivot).get(from);
    //   pivotNodes.forEach(toPivot => {
    //     let toPivotNodeToTo = nodeDistanceLookup.get(toPivot).get(to);
    //     let pivotDistance = nodeDistanceLookup.get(fromPivot).get(toPivot);

    //     let d = fromPivotNodeToFrom + toPivotNodeToTo + pivotDistance;
    //     if (!Number.isFinite(d)) throw new Error('Something wrong with approximation')
    //     if (d < shortestSum) shortestSum = d;
    //   });
    // })

    // return shortestSum;
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

function getVecDistance(a, b) {
  if (a.length !== b.length) throw new Error('Dimensions mismatch')
  let sum = 0;
  for (let i = 0; i < a.length; ++i) {
    let delta = a[i] - b[i];
    sum += delta * delta;
  }
  return Math.sqrt(sum)/a.length;
}

function getDeltaDistance(a, b) {
  if (a.length !== b.length) throw new Error('Dimensions mismatch')
  let minSum = 0;
  let maxSum = 0;
  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < a.length; ++i) {
    let delta = b[i] - a[i];
    if (delta < min) min = delta;
    if (delta > max) max = delta;
    minSum += Math.min(a[i], b[i]);
    maxSum += Math.max(a[i], b[i]);
  }
  return minSum/(a.length); //Math.sqrt(sum);
}