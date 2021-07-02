# Explore node2vec

I was just curious to explore [node2vec graph embeddings](https://snap.stanford.edu/node2vec/) in
a visual way.

This repository uses a primitive `10x10` grid graph, performs various embeddings with node2vec
and then performs graph layout [by minimizing stress](https://arxiv.org/pdf/1710.04626.pdf), 
where distance between nodes is taken in embedded space.

There are many hyperparameters to tune in this schema. So far I haven't found a good configuration
that would result in nice looking layouts of embedded space, but still though it is worth to
share this repository in case if someone else is curious.

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



