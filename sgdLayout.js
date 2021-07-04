import path from 'path'

import readGraph from './src/readGraph.js'
import createLayout from './src/createLayout.js'
import saveGraphToSvg from './src/saveGraphToSvg.js'
import assignGraphTheoreticalDistances from './src/assignGraphTheoreticalDistances.js';

const graphName = process.argv[2];
const baseName = path.basename(graphName, '.txt');

readGraph(graphName).then(graph => {
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