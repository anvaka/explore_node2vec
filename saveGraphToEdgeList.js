import fs from 'fs';

export default function saveToEdgeList(fileName, graph) {
  return new Promise((resolve) => {
    const writeStream = fs.createWriteStream(fileName);
    const nodeIndex = new Map();
    let count = 1; 
    graph.forEachNode(node => {
      count += 1;
      nodeIndex.set(node.id, count);
    });

    graph.forEachLink(link => {
      let fromId = nodeIndex.get(link.fromId);
      let toId = nodeIndex.get(link.toId);
      writeStream.write(fromId + ' ' + toId + '\n');
    });

    writeStream.on('finish', resolve);
    writeStream.end();
  })
}