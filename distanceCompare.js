/**
 * Trying to see if I could approximate all shortest paths
 */

import readGraph from './src/readGraph.js'
import createActualDistance from './src/createActualDistance.js';
import createApproximateDistance from './src/createApproximateDistance.js'
import sampleGraph from './src/sampleGraph.js'

const graphName = process.argv[2];

readGraph(graphName).then(graph => {
  const getGraphTheoreticalDistance = createActualDistance(graph);

  for (let i = 1; i < graph.getNodeCount(); ++i) {
    const pivotNodes = sampleGraph(graph, i);
    const getApproximateDistance = createApproximateDistance(graph, pivotNodes);
    let error = 0;
    let count = 0;
    let all = [];

    graph.forEachNode(node => {
      graph.forEachNode(other => {
        let actual = getGraphTheoreticalDistance(node, other)
        let approximate = getApproximateDistance(node, other)
        let delta = Math.abs(actual - approximate)
        all.push(delta);
        error += delta;
        count += 1;
      });
    });

    all.sort((a, b) => b - a);
    console.log('Iteration ' + i + '. Total Error: ' + error + '; Avg error: ' + error / count + '; Max error: ' + all[0] + '; Min error: ' + all[all.length - 1] + '; P50: ' + all[Math.floor(all.length /2)])
  }
});
