import forEachLine from 'for-each-line';
import fs from 'fs'
import path from 'path'
import createGraph from 'ngraph.graph';

import createLayout from './src/createLayout.js'
import saveGraphToSvg from './src/saveGraphToSvg.js'

const embeddingName = process.argv[2];
const graphName = process.argv[3];

if (!fs.existsSync(embeddingName)) {
  throw new Error('Embedding file does not exist ' + embeddingName);
}
if (!fs.existsSync(graphName)) {
  throw new Error('Graph file does not exist ' + graphName);
}

const graph = createGraph();

let lineNumber = 0;

forEachLine(embeddingName, line => {
  lineNumber += 1;
  if (lineNumber === 1) return; // ignore the first line
  let parts = line.split(' ');
  let node;

  parts.forEach((p, idx) => {
    if (idx === 0) {
      node = {
        id: Number.parseInt(p, 10),
        vec: []
      };
    } else {
      let x = Number.parseFloat(p);
      if (!Number.isFinite(x)) throw new Error('Unexpected number ' + x);
      node.vec.push(x);
    }
  });

  graph.addNode(node.id, {
    vec: node.vec
  });
}).then(readRealGraph)
.then(() => {
  console.log('Read graph with ' + graph.getNodeCount() + ' nodes and ' + graph.getLinkCount() + ' links');
  console.log('Performing layout...');

  const layout = createLayout(graph);
  layout.run(15);

  const baseName = path.basename(embeddingName, '.txt');
  let meta = getMetaInformation(baseName, layout);
  console.log(meta);
  saveGraphToSvg(
    path.join('svg', baseName + '.svg'), 
    graph, layout, meta
  );
})

function readRealGraph() {
  return forEachLine(graphName, line => {
    let parts = line.split(' ').map(x => Number.parseInt(x, 10));

    parts.forEach(p => {
      if (!graph.hasNode(p)) throw new Error('Missing node: ' + p + '; Are you an isolated node or a bug?');
    });

    graph.addLink(parts[0], parts[1]);
  });
}

function getMetaInformation(name, layout) {
  const keyMap = {
    d: 'Number of dimensions (-d)',
    l: 'Length of walk per source (-l)',
    r: 'Number of walks per source (-r)',
    k: 'Context size for optimization (-k)',
    e: 'Number of epochs in n2v SGD (-e)',
    p: 'Return hyperparameter (-p)',
    q: 'Inout hyperparameter (-q)'
  }

  let [graphName, metaParts] = name.split('.');
  let meta = metaParts.split('_').map(param => {
    let description = keyMap[param[0]];
    if (description === undefined) throw new Error('Unknown name parameter ' + param + ' in ' + name);

    let val = Number.parseFloat(param.substr(1));
    if (!Number.isFinite(val)) throw new Error('Unknown parameter value ' + val + ' in ' + name);
    return description + ': ' + val;
  });

  meta.unshift('Stress: ' + layout.getStress())
  meta.unshift('Graph: ' + graphName)
  return meta;
}