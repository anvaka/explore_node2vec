#!/bin/bash

## Need to create graphs first
# node createTestGraphs

# Get the node2vec from https://github.com/snap-stanford/snap/tree/master/examples/node2vec
# Compile it and set the path here:
node_to_vec=/home/unvaka/ml/snap/examples/node2vec/node2vec

# input_file=grid10x10.txt
input_file=miserables.txt

# These are node2vec parameters:

number_of_dimensions=180
length_of_walk=80
walks_per_source=4

# Context size for optimization
context_size=10
epochs_count=4

return_hyper_parameter=400
inout_hyper_parameter=1

base_name=`basename $input_file .txt`

output_file_name="$base_name.d$number_of_dimensions"_\
"l$length_of_walk"_\
"r$walks_per_source"_\
"k$context_size"_\
"e$epochs_count"_\
"p$return_hyper_parameter"_\
"q$inout_hyper_parameter".n2v.txt

$node_to_vec -v -i:$input_file -o:emb/$output_file_name \
-d:$number_of_dimensions \
-l:$length_of_walk \
-r:$walks_per_source \
-k:$context_size \
-e:$epochs_count \
-p:$return_hyper_parameter \
-q:$inout_hyper_parameter

node n2vlayout.js ./emb/$output_file_name $input_file

# for d in $(seq 1 5 500)
# do
# return_hyper_parameter=$d
# output_file_name="$base_name.d$number_of_dimensions"_\
# "l$length_of_walk"_\
# "r$walks_per_source"_\
# "k$context_size"_\
# "e$epochs_count"_\
# "p$return_hyper_parameter"_\
# "q$inout_hyper_parameter".n2v.txt

# $node_to_vec -v -i:$input_file -o:emb/$output_file_name \
#   -d:$number_of_dimensions \
#   -l:$length_of_walk \
#   -r:$walks_per_source \
#   -k:$context_size \
#   -e:$epochs_count \
#   -p:$return_hyper_parameter \
#   -q:$inout_hyper_parameter

# node n2vlayout.js ./emb/$output_file_name $input_file
# done