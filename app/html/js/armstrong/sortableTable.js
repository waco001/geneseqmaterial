function tableChart() {
	// define variables
	var quantDim = {
			'height': 15,
			'width': 155,
			'barGap': 3,
			'barWidth': 100,
			'enrichLength': 300
		},
		//quantColumns = ["foldEnrichment", "meanTPM"],
		quantColumns = ["foldEnrichment"],
		format = {
			"foldEnrichment": d3.format(",.0f"),
			"meanTPM": d3.format(",.0f"),
			"pValue": d3.format(".0e"),
		},
		scales = {
			// TODO: determine domains from data
			"meanTPM": d3.scale.log().range([0, quantDim.barWidth]).domain([0.77, 82189]),
			"foldEnrichment": d3.scale.log().range([0, quantDim.barWidth]).domain([1.4, 209461]),
			"cellEnrichment": d3.scale.log().range([0, quantDim.enrichLength - 10]).domain([10, 82189])
		},
		currentData = [],
		selectedGenes = [];

	// main function
	function table(selection) {
		selection.each(function(data) {

			// enter rows of table
			var rows = d3.select(this).select("tbody").selectAll("tr")
				.data(data, function(d) {
					return d.geneID
				})

			// enter rows
			rowsEnter = rows.enter()
				.append("tr");

			enterRows(rowsEnter)

		})

	}

	// helpers
	function matchSelectedGenes(geneIDList) {
		return function(point) {
			return (geneIDList.indexOf(point.geneID) != -1) ? true : false
		}
	}

	function defineInteractions(rows) {

		function matchGeneId(geneID) {
			return function(point) {
				if (point.geneID == geneID) {
					return true
				} else {
					return false
				}
			}
		}

		// when a row in the table is selected, show that on table and in scatterplot
		rows.on("mouseover", function(d) {
			d3.selectAll(".mouse_genes").classed("pulse", matchGeneId(d.geneID))
		})

		rows.on("mouseout", function(d) {
			d3.selectAll(".mouse_genes").classed("pulse", false)
		})

		rows.on("click", function(d) {
			d3.selectAll(".mouse_genes").classed("pulse", false)

			var index = selectedGenes.indexOf(d.geneID)
			if (index == -1) {
				selectedGenes.push(d.geneID);
				d3.select(this).classed("selected", true)
			} else {
				selectedGenes.splice(index, 1)
				d3.select(this).classed("selected", false)
			}
			d3.selectAll(".mouse_genes").classed("selectedGenes", matchSelectedGenes(selectedGenes));
		})
	}

	// enter
	function enterRows(rows) {
		rows.classed("table-rows", true)

		// for each row, append the gene id
		rows.append("th")
			.text(function(d) {
				return d.geneID;
			});

		// for each row, append the cell type
		rows.append("td").text(function(d) {
			return d.enrichedIn;
		})

		// for each row, append the quantiative cells
		var elements = rows.selectAll(".td-quant")
			.data(function(d) {
				return quantColumns.map(function(k) {
					return {
						"type": k,
						"data": d[k]
					};
				});
			})
			.enter().append("td").attr("class", "td-quant")
			.append("svg")
			.attr("width", quantDim.width)
			.attr("height", quantDim.height)

		// sort quant columns (fold)
		d3.selectAll("thead .td-quant").data(quantColumns).on("click", function(k) {
			d3.select("tbody").selectAll("tr").sort(function(a, b) {
				return b[k] - a[k]
			});
		});

		// add in the bar for the bar charts
		elements
			.append("rect")
			.attr("y", 3)
			.attr("height", quantDim.height - 3)
			.attr("width", function(d) {
				return scales[d.type](d.data)
			})

		// and the text
		elements.append("text")
			.text(function(d) {
				return format[d.type](d.data)
			})
			.attr("x", function(d) {
				return quantDim.barWidth + 5
			})
			.attr("y", quantDim.height - 3);

		var cellTypeVis = rows.append('td').attr("class", "enrichedVis")
			.append('svg')
			.attr("width", quantDim.enrichLength)
			.attr("height", quantDim.height)

		d3.selectAll("thead .td-expression").on("click", function() {
			d3.select("tbody").selectAll("tr").sort(function(a, b) {
				return b.enrichedCellTypes.max - a.enrichedCellTypes.max
			});
		});

		/*
		cellTypeVis.append("text").text(function(d) {
			return d.enrichedCellTypes.max
		}).attr("x", 5).attr("y", 5)
		*/

		cellTypeVis.on("click", function(d) {
			console.log(d)
		})

		cellTypeVis.append("line").attr({
			'x1': 0,
			'x2': function(d) {
				return scales.cellEnrichment(d.enrichedCellTypes.max)
			},
			'y1': 5,
			'y2': 5,
			'stroke': 'grey',
			'stroke-width': .5
		})

		cellTypeVis.selectAll(".enrichedCells")
			.data(function(d) {
				return d.enrichedCellTypes.enrichedIn
			})
			.enter()
			.append("circle")
			.attr({
				"r": 2,
				"cx": function(d) {
					return scales.cellEnrichment(d.enrichedValue)
				},
				"cy": 5,
				"fill": 'grey',
				"opacity": .5
			})


		// to all rows, new and existing
		defineInteractions(rows);
		rows.classed("selected", matchSelectedGenes(selectedGenes))
	}

	// table methods
	table.setSelectedGenes = function(_) {
		if (!arguments.length) return selectedGenes;
		selectedGenes = _;
		return table;
	}

	table.updateData = function(data) {

		var rows = d3.select("tbody")
			.selectAll("tr")
			.data(data, function(d) {
				return d.geneID
			})

		// exit
		rows.exit().remove()

		// enter
		var tr = rows.enter().append('tr')
		enterRows(tr, {})

		// note: no update step
	}

	return table;
}