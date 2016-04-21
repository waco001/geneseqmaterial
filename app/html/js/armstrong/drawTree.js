function treeLegend() {
  // define variables
  var dim = {
      "width": 650,
      "height": [130, 300],
      "totalHeight": 500
    },
    dispatcher = [],
    selectedTypes = [];

  // define cluster
  var cluster = d3.layout.cluster()
    .children(function children(d) {
      return d.values
    });

  var diagonal = d3.svg.diagonal()
    .projection(function(d) {
      return [d.y, d.x];
    });


  function tree(selection) {
    selection.each(function(data) {

      var nested_data = d3.nest()
        .key(function(d) {
          return d.root;
        }).key(function(d) {
          return d.level1;
        }).key(function(d) {
          if (d.level2) {
            return d.level2;
          }
        }).key(function(d) {
          if (d.level3) {
            return d.level3;
          }
        })
        .rollup(function(leaves) {
          return ""
        }).entries(data);

      setupNodes(nested_data, selection);
      tree.showSelections();
      defineInteractivity();
    })

  }

  // helper methods
  function setupNodes(nested_data, selection) {
    for (k in nested_data) {
      var root = nested_data[k]

      cluster.size([dim.height[k], dim.width - 160]);

      // remove undefined nodes
      var nodes = cluster.nodes(root).filter(function(d) {
        return d.key != 'undefined';
      });

      // remove empty children
      var nodes = nodes.map(function(node) {
        if (node.children) {
          for (i in node.children) {
            if (node.children[i].key == 'undefined') {
              node.children.splice(i, 1)
            }
          }
          if (node.children.length == 0) {
            delete node.children
          }
        }

        return node
      })

      var links = cluster.links(nodes);

      nodes.forEach(function(d) {
        d.y = d.depth * 100;
      });

      var dendro = selection.append("g").attr("class", "dendro_" + k).attr("transform", "translate(0," + k * dim.height[k - 1] * 1.1 + ")")

      var link = dendro.selectAll(".link")
        .data(links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", diagonal);

      var node = dendro.selectAll(".node_" + k)
        .data(nodes)
        .enter().append("g")
        .attr("class", "node node_" + k)
        .attr("transform", function(d) {
          return "translate(" + d.y + "," + d.x + ")";
        })

      node.append("circle")
        .attr("r", 2);

      node.append("text")
        .attr("dx", function(d) {
          return d.depth == 0 ? -8 : 8;
        })
        .attr("dy", function(d) {
          return (d.depth != 0 && d.children) ? -3 : 3;
        })
        .attr("class", "cellTypeLabels")
        .style("text-anchor", function(d) {
          if (d.depth == 0) {
            return "end"
          } else {
            return d.children ? "middle" : "start";
          }
        })
        .text(function(d) {
          if (d.key != 'undefined') {
            return d.key;
          }
        });
    }
  }

  function defineInteractivity() {

    d3.selectAll(".cellTypeLabels")
      .on("mouseover", function(cellType) {
        cellType = cellType.key.replace(/\s+/g, '-')
        d3.select(this).classed("hovered", true)
        d3.selectAll(".mouse_genes").classed("unhovered", true)
        d3.selectAll("." + cellType).classed("hovered", true).classed("unhovered", false)
      })
      .on("mouseout", function() {
        d3.select(this).classed("hovered", false)
        d3.selectAll(".mouse_genes").classed("unhovered", false).classed("hovered", false)
      })
      .on("click", function(d) {
        dispatch.updateCellTypeSelection(d.key)
      })
  }

  // methods belonging to tree
  tree.showSelections = function() {
    d3.selectAll(".cellTypeLabels").classed("selected", function(d) {
      if (selectedTypes.indexOf(d.key) != -1) {
        return true
      } else {
        return false
      }
    })
  }

  tree.setDispatcher = function(_) {
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return tree;
  }

  tree.setSelectedTypes = function(_) {
    if (!arguments.length) return selectedTypes;
    selectedTypes = _;
    return tree;
  }

  tree.getSelectedTypes = function() {
    return selectedTypes
  }

  // return tree
  return tree
}