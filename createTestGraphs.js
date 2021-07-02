import saveToEdgeList from './saveGraphToEdgeList.js';
import miserables from 'miserables';
import generator from 'ngraph.generators';

saveToEdgeList('miserables.txt', miserables).then(x => {
  console.log('saved miserables graph to miserables.txt')
})

saveToEdgeList('grid10x10.txt', generator.grid(10, 10)).then(x => {
  console.log('saved 10x10 grid graph to grid10x10.txt')
})