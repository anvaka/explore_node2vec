import Matrix from './Matrix.js';

export default function sampleGraph(graph, pivotCount) {
  let nodeIdToNumber = new Map();
  let nodes = [];

  graph.forEachNode(node => {
    let id =  nodes.length;
    nodeIdToNumber.set(node.id, id);
    nodes.push(node.id);
  });
 
  pivotCount = Math.min(pivotCount, nodes.length);
 
  return computePivotNodes(nodes[0]).map(id => graph.getNode(id));
 
  function computePivotNodes(pivot) {
    let bfsDist = Array(nodes.length).fill(Infinity);
    let matrix = new Matrix(pivotCount, nodes.length);
    let pivotNodes = [];

    for (let i = 0; i < pivotCount; ++i) {
      pivotNodes.push(pivot);
      addRow(matrix, i, pivot);

      let indexOfMaxValue = bfsDist.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
      pivot = nodes[indexOfMaxValue];
    }

    return pivotNodes;

    function addRow(matrix, rowNumber, pivotNode) {
      let queue = [{node: pivotNode, d: 0}];
      let visited = new Set([pivotNode]);
      while (queue.length) {
        let next = queue.shift();
        let column = nodeIdToNumber.get(next.node);
        matrix.set(rowNumber, column, next.d);
        bfsDist[column] = Math.min(bfsDist[column], next.d);

        graph.forEachLinkedNode(next.node, other => {
          if (visited.has(other.id)) return;
          queue.push({
            node: other.id,
            d: next.d + 1
          });
          visited.add(other.id)
        })
      }

      if (visited.size !== nodes.length) {
        throw new Error('Graph has disconnected component. Please use ngraph.hde once per individual component');
      }
    }
  }
}