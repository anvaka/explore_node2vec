# Explore node2vec via stress minimization graph layout

**Stress minimization** is family of graph layout algorithms that produces
nice looking two dimensional visualizations of graphs by minimizing difference
between "ideal" desired distance and actual distance of nodes.

For example, given graph of city roads, such algorithm could use ground truth about
distances of road segments, and converge on globally optimal solution, producing
layouts that [match exactly](https://twitter.com/anvaka/status/1409002908725649410) 
what we have on a map:

![Seattle roads rendered with stress minimization](https://i.imgur.com/Ex4S0v1.png)

For abstract graphs we can assign distance between two nodes based on shortest path
length between them (this distance is also called "graph theoretical distance"):

![chetumal rendered with real and graph theoretical distance](https://i.imgur.com/gAzEFYx.png)

**node2vec** is an algorithm that assigns a high dimensional vector to each node of a graph.
The algorithm tries to preserve similarity between nodes on the graph (similar nodes of the
graph are close in the high dimensional space).

Since `node2vec` gives us vectors, we can always measure distance between nodes in such
space and use it as "ideal" desired distance of stress minimization algorithm. This repository
explores [node2vec graph embeddings](https://snap.stanford.edu/node2vec/) with stress minimization.

Why this could be important? The answer is twofold:

1. Stress minimization requeres graph theoretical distance between every single node in the graph.
In most cases this requeres at least `O(n^2)` memory and `O(n * (m + n))` preprocessing time. Having
nice node embeddings could potentially speed up stress minimization driven graph layouts.

2. `node2vec` embedding algorithms have a lot of hyperparemeters. Stress minimization driven
graph layout algorithm can help researchers judge quality of selected embedding by visually exploring
produced layouts and quantitatively observing final `stress cost` function value.

## Test setup

This repository uses two graphs: a primitive `10x10` grid graph, and `miserables` graph. 

It performs various embeddings with node2vec and then performs graph layout, following 
[Graph Drawing by Stochastic Gradient Descent](https://arxiv.org/pdf/1710.04626.pdf) paper.
Isntead of graph-theoretical distance we take distance between nodes in embedded space.

## Results

For `miserables` graph, embeddings in very high dimensional space produced results very similar
to ideal, graph-theoretical distances. Image below used `4,048` dimensions in the embedded space:

![miserables in 4048 dimensions](https://i.imgur.com/gYkz8fA.png)

However going to smaller number of dimensions results in poor layouts:

![miserable in 180 dimensions](https://i.imgur.com/QuuPs7d.png)

For `10x10` grid I wasn't able to find a good embedding, no matter how many dimensions I used.
Image below used `1,048` dimensions for embedding:

![grid in 1048 dimensions](https://i.imgur.com/PneQ5JN.png)

## Feedback

If you find a bug in the code, please don't hesitate to [ping me](https://twitter.com/anvaka).

## Usage

To setup code make sure you have downloaded and compiled `node2vec` tool:

```
git clone https://github.com/snap-stanford/snap/
cd snap/examples/node2vec
make
```

This should create an executable `node2vec` file. Remember path to it, as it will
be needed later.

Now, clone this repository and install its dependencies:

```
git clone https://github.com/anvaka/explore_node2vec/
cd explore_node2vec
npm install
```

Open [sequence.sh](./sequence.sh) and modify `node_to_vec` variable to point to your
compiled `node2vec`.

Create test graph with `node createTestGraphs.js`, and launch `sequence.sh` to produce
layouts into `svg` folder



