function scatterSelector() {
	// declare variables
	var scales = {
			'x': d3.scale.log().range([0, chartDim]),
			'y': d3.scale.log().range([chartDim, 0])
		},
		labels = {
			xTitle: "Expression Levels in this Cell Type",
			yTitle: "Fold Enrichment compared to Next Best Cell Type",
			scatterTitle: "Mouse Genes by Expression Levels, Fold Enrichment, and Cell Type"
		},
		selected,
		noselected;

	var cellTypesUpstream = {
		"Lhx5 midbrain interneuron": "Lhx5-midbrain-interneuron interneuron neuron ",
		"S100a10 pyramidal neuron": "S100a10-pyramidal-neuron pyramidal-neuron projection-neuron neuron ",
		"microglia": "microglia glia ",
		"oligodendrocyte": "oligodendrocyte glia ",
		"interneuron": "interneuron neuron ",
		"newly formed oligodendrocyte": "newly-formed-oligodendrocyte oligodendrocyte glia ",
		"Lhx5 hypothalamic interneuron": "Lhx5-hypothalamic-interneuron inhibitory-interneuron interneuron neuron ",
		"AGRP projection neuron": "AGRP-projection-neuron projection-neuron neuron ",
		"oligodendrocyte precursor": "oligodendrocyte-precursor oligodendrocyte glia ",
		"AGRP neuron": "AGRP-neuron AGRP-projection-neuron projection-neuron neuron ",
		"SNpc dopaminergic neuron": "SNpc-dopaminergic-neuron dopaminergic-neuron projection-neuron neuron ",
		"Abcb1a blood vessel": "Abcb1a-blood-vessel endothelial glia ",
		"dopaminergic neuron": "dopaminergic-neuron projection-neuron neuron ",
		"Stard8 neuron": "Stard8-neuron dopaminergic-neuron projection-neuron neuron ",
		"POMC neuron": "POMC-neuron POMC-projection-neuron projection-neuron neuron ",
		"Cbln1 neuron": "Cbln1-neuron granule-cell neuron ",
		"medium spiny neuron": "medium-spiny-neuron projection-neuron neuron ",
		"cholinergic neuron": "cholinergic-neuron projection-neuron neuron ",
		"subcerebral projection neuron": "subcerebral-projection-neuron pyramidal-neuron projection-neuron neuron ",
		"myelinating oligodendrocyte": "myelinating-oligodendrocyte oligodendrocyte glia ",
		"ependymal": "ependymal glia ",
		"glia": "glia ",
		"POMC projection neuron": "POMC-projection-neuron projection-neuron neuron ",
		"Glt25d2 pyramidal neuron": "Glt25d2-pyramidal-neuron pyramidal-neuron projection-neuron neuron ",
		"Slc17a6 neuron": "Slc17a6-neuron periglomerular-neuron interneuron neuron ",
		"Aldh1l1 astrocyte": "Aldh1l1-astrocyte astrocyte glia ",
		"neuron": "neuron ",
		"corticothalamic projection neuron": "corticothalamic-projection-neuron pyramidal-neuron projection-neuron neuron ",
		"VTA dopaminergic neuron": "VTA-dopaminergic-neuron dopaminergic-neuron projection-neuron neuron ",
		"GABAergic neuron": "GABAergic-neuron projection-neuron neuron ",
		"projection neuron": "projection-neuron neuron ",
		"Epyc neuron": "Epyc-neuron GABAergic-neuron projection-neuron neuron ",
		"ChAT neuron": "ChAT-neuron cholinergic-neuron projection-neuron neuron ",
		"endothelial": "endothelial glia ",
		"Drd1 neuron": "Drd1-neuron medium-spiny-neuron projection-neuron neuron ",
		"granule cell": "granule-cell neuron ",
		"pyramidal neuron": "pyramidal-neuron projection-neuron neuron ",
		"astrocyte": "astrocyte glia ",
		"Chrna5 neuron": "Chrna5-neuron GABAergic-neuron projection-neuron neuron ",
		"callosal projection neuron": "callosal-projection-neuron pyramidal-neuron projection-neuron neuron ",
		"inhibitory interneuron": "inhibitory-interneuron interneuron neuron ",
		"Drd2 neuron": "Drd2-neuron medium-spiny-neuron projection-neuron neuron ",
		"periglomerular neuron": "periglomerular-neuron interneuron neuron ",
		"Dcdc2a ependymal": "Dcdc2a-ependymal ependymal glia "
	}

	var xAxis = d3.svg.axis().orient(["bottom"]).ticks(8, tickformat),
		yAxis = d3.svg.axis().orient(["left"]).ticks(6, tickformat);



	function scatter(selection) {
		selection.each(function(data) {
			appendLabels(d3.select(this));

			// use input max/min of data to set x and y domains	
			setDomains(data, scales)


			// use new domain to update xAxis, yAxis, and noSeletion
			xAxis.scale(scales.x);
			yAxis.scale(scales.y);

			noSelection = [
				[scales.x.domain()[0], scales.y.domain()[0]],
				[scales.x.domain()[1], scales.y.domain()[1]]
			]


			var svg = d3.select(this).append("g")
				.selectAll(".mouse_genes")
				.data(data, function(d) {
					return d.geneID
				})

			// enter points
			svg.enter().append("circle")
				.attr("cx", function(d) {
					return scales.x(d.meanTPM);
				})
				.attr("cy", function(d) {
					return scales.y(d.foldEnrichment);
				})
				.attr("r", 2)
				.attr("opacity", .7)
				//.attr("class", "mouse_genes")
				.attr("class", function(d) {
					return "mouse_genes" + " " + cellTypesUpstream[d.enrichedIn]
				})

			d3.select(this).append("g").attr("class", "x axis").attr("transform", "translate(0," + chartDim + ")").call(xAxis)
			d3.select(this).append("g").attr("class", "y axis").call(yAxis)

			setUpExtentsOnAxis(d3.select(this))
			setUpBrush(d3.select(this).append("g"), selection, brush)

		})
	}

	// helper functions
	function appendLabels(svg) {
		svg.append("text")
			.attr("text-anchor", "middle")
			.attr("class", "x title")
			.attr("transform", "translate(" + chartDim / 2 + "," + (chartDim + 60) + ")")
			.text(labels.xTitle);

		svg.append("text")
			.attr("text-anchor", "middle")
			.attr("class", "y title")
			.attr("transform", "translate(" + -70 + "," + chartDim / 2 + ") rotate(-90)")
			.text(labels.yTitle);

		svg.append("text")
			.attr("text-anchor", "middle")
			.attr("class", "main title")
			.attr("transform", "translate(" + chartDim / 2 + "," + -20 + ")")
			.text(labels.scatterTitle);
	}


	function setUpExtentsOnAxis(extents) {
		extents.append("rect").attr({
			class: "extents xExtent",
			y: chartDim,
			height: 30
		})
		extents.append("rect").attr({
			class: "extents yExtent",
			x: -35,
			width: 35
		})

		extents.append("text")
			.attr({
				x: -58,
				class: "extents yMax"
			})
		extents.append("text")
			.attr({
				x: -58,
				class: "extents yMin"
			})
		extents.append("text")
			.attr({
				y: chartDim + 42,
				class: "extents xMax"
			})
		extents.append("text")
			.attr({
				y: chartDim + 42,
				class: "extents xMin"
			})
	}

	// set up brush, and brush functions
	var brush = d3.svg.brush()
		.x(scales.x)
		.y(scales.y)
		.on("brush", brushed)
		.on("brushend", brushend);

	function brushed() {
		if (brush.empty()) {
			var extent = noSelection
			selection.brush = 0
		} else {
			var extent = brush.extent()
			selection.brush = 1
		}

		selection.fold = [Math.min(extent[0][1], extent[1][1]), Math.max(extent[0][1], extent[1][1])]
		selection.enrich = [Math.min(extent[0][0], extent[1][0]), Math.max(extent[0][0], extent[1][0])]

		updateAxisExtents(selection)
	}

	function brushend() {
		dispatch.extentChanged(selection)
	}

	function setUpBrush(elem, selection, brush) {
		if (selection.brush) {
			brush = brush.extent([
				[selection.enrich[0], selection.fold[0]],
				[selection.enrich[1], selection.fold[1]]
			]);
		}
		// append brush

		elem.attr("class", "brush")
			.call(brush)
			.call(brush.event)
	}


	function setDomains(data, scales) {
		scales.x.domain(d3.extent(data, function(d) {
			return +d.meanTPM
		}));

		scales.y.domain(d3.extent(data, function(d) {
			return +d.foldEnrichment
		}));

	}

	function updateAxisExtents(selection) {
		if (selection.brush) {
			d3.selectAll(".extents").classed('hidden', false);

			// update rectangles
			d3.selectAll(".xExtent")
				.attr("x", scales.x(selection.enrich[0]))
				.attr("width", scales.x(selection.enrich[1]) - scales.x(selection.enrich[0]))

			d3.selectAll(".yExtent")
				.attr("y", scales.y(selection.fold[1]))
				.attr("height", scales.y(selection.fold[0]) - scales.y(selection.fold[1]))

			// update labels
			d3.select(".yMax")
				.attr("y", scales.y(selection.fold[1]) - 2)
				.text(d3.format(",.0f")(selection.fold[1]))

			d3.select(".yMin")
				.attr("y", scales.y(selection.fold[0]) - 2)
				.text(d3.format(",.0f")(selection.fold[0]))

			d3.select(".xMax")
				.attr("x", scales.x(selection.enrich[1]) - 20)
				.text(d3.format(",.0f")(selection.enrich[1]))

			d3.select(".xMin")
				.attr("x", scales.x(selection.enrich[0]))
				.text(d3.format(",.0f")(selection.enrich[0]))
		} else {
			d3.selectAll(".extents").classed('hidden', true);
		}
	}


	// methods on scatter
	scatter.updateSelections = function(downstream) { // update mouse selections
		d3.selectAll(".mouse_genes").classed("selected", function(d) {
			if (downstream.indexOf(d.enrichedIn) != -1) {
				return true
			} else {
				return false
			}
		})
	}

	return scatter
}