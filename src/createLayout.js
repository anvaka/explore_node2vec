import ngraphRandom from 'ngraph.random';

export default function createLayout(graph, customDistance) {
  const rnd = ngraphRandom(42);
  const totalNodes = graph.getNodeCount();
  const getDistance = customDistance || getEuclidVecDistance;

  let dimensions;
  let zero;
  // We will use max distance to compute schedule
  let maxDistance = -Infinity;
  let nodes = [];
  graph.forEachNode(node => {
    if (node.position === undefined) {
      node.position = {
        x: rnd.gaussian() * totalNodes,
        y: rnd.gaussian() * totalNodes
      }
    }

    node.vec = node.data.vec;
    if (!node.vec) throw new Error('Node is missing embedding information ' + node.id);
    if (dimensions === undefined) {
      dimensions = node.vec.length;
      zero = Array(dimensions).fill(0);
    } else if (dimensions != node.vec.length) {
      throw new Error('All nodes should have the same embedded dimension');
    }

    let d = getDistance(zero, node.vec);
    if (d > maxDistance) maxDistance = d;

    nodes.push(node);
  });
  const iterator = ngraphRandom.randomIterator(nodes, rnd);

  return {
    run,
    getNodePosition,
    getStress,
  }

  function getStress() {
    let stress = 0;
    for (let i = 0; i < nodes.length - 1; ++i) {
      let from = nodes[i];
      for (let j = i + 1; j < nodes.length; ++j) {
        let to = nodes[j];
        let d = getDistance(from.vec, to.vec);
        let w = getWeight(d);
        let dx = from.position.x - to.position.x;
        let dy = from.position.y - to.position.y;
        let offset = d - Math.sqrt(dx * dx + dy * dy);
        stress += w * offset * offset;
      }
    }

    return stress;
  }

  function getNodePosition(nodeId) {
    return graph.getNode(nodeId).position;
  }

  function run(iterationCount) {
    let schedule = createSchedule(iterationCount, maxDistance * 2, 0.1);
    schedule.forEach(learningRate => {
      // iterator.shuffle();
      for (let i = 0; i < nodes.length - 1; ++i) {
        for (let j = i + 1; j < nodes.length; ++j) {
          updateNodePosition(nodes[i], nodes[j], learningRate);
        }
      }
    });
  }

  function getWeight(dij) {
    return dij === 0 ? 1 : 1/(dij * dij);
  }

  function updateNodePosition(from, to, learningRate) {
    if (from === to) return;

    const dij = getDistance(from.vec, to.vec);
    let tao = getWeight(dij) * learningRate;

    if (tao > 1) tao = 1;
    const dx = from.position.x - to.position.x;
    const dy = from.position.y - to.position.y;

    if (!Number.isFinite(dij)) return; // Can't update this pair

    const d = Math.sqrt(dx * dx + dy * dy);
    const scaler = (d - dij) / (2 * d);
    const rx = tao * dx * scaler;
    const ry = tao * dy * scaler;
    from.position.x -= rx;
    from.position.y -= ry;
    to.position.x += rx;
    to.position.y += ry;
  }

  function createSchedule(steps, maxD, eps = 0.1) {
    let eta_max = maxD * maxD;
    let eta_min = eps;
    let lambda = Math.log(eta_max/eta_min) / (steps - 1);

    let schedule = [];

    for (let t = 0; t < steps; t++){
      schedule.push(eta_max * Math.exp(-lambda * t));
    }

    return schedule;
  }
}

function getEuclidVecDistance(a, b) {
  if (a.length !== b.length) throw new Error("vector dimensions mismatch");
  let sum = 0;
  for (let i = 0; i < a.length; ++i) {
    let dx = a[i] - b[i];
    sum += dx * dx;
  }
  return Math.sqrt(sum);
}