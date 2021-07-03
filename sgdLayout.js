import forEachLine from 'for-each-line';
import fs from 'fs'
import path from 'path'
import createGraph from 'ngraph.graph';

import createLayout from './src/createLayout.js'
import saveGraphToSvg from './src/saveGraphToSvg.js'
import assignGraphTheoreticalDistances from './src/assignGraphTheoreticalDistances.js';

const graphName = process.argv[2];
const baseName = path.basename(graphName, '.txt');

if (!fs.existsSync(graphName)) {
  throw new Error('Graph file does not exist ' + graphName);
}

const graph = createGraph();
forEachLine(graphName, line => {
  let parts = line.split(' ').map(x => Number.parseInt(x, 10));
  graph.addLink(parts[0], parts[1]);
}).then(() => {
  console.log('Read graph with ' + graph.getNodeCount() + ' nodes and ' + graph.getLinkCount() + ' links');
  console.log('Computing all shortest paths')
  const getGraphTheoreticalDistance = assignGraphTheoreticalDistances(graph);

  console.log('Performing layout...');

  const layout = createLayout(graph, getGraphTheoreticalDistance);
  layout.run(15);

  let meta = getMetaInformation(layout);
  console.log(meta);
  saveGraphToSvg(
    path.join('svg', baseName + '.svg'), 
    graph, layout, meta
  );
})

function getMetaInformation(layout) {
  const meta = [
    'Graph: ' + graphName,
    'Stress: ' + layout.getStress(),
  ];
  return meta;
}