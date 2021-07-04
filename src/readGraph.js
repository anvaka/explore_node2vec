import fs from 'fs'
import forEachLine from 'for-each-line';
import createGraph from 'ngraph.graph';

export default function readGraph(graphName) {
  if (!fs.existsSync(graphName)) {
    throw new Error('Graph file does not exist ' + graphName);
  }
  const graph = createGraph();
  return forEachLine(graphName, line => {
    let parts = line.split(' ').map(x => Number.parseInt(x, 10));
    graph.addLink(parts[0], parts[1]);
  }).then(() => graph);
}