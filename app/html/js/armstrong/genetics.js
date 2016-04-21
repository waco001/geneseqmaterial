'use strict';

// STANDARD VARIABLES
var margin = {
	top: 50,
	right: 300,
	bottom: 50,
	left: 120
},
width = 2000,
height = 520,
tickformat = ".1s",
chartDim = 500;

var scales = {
	'x': d3.scale.log().range([0, chartDim]),
	'y': d3.scale.log().range([chartDim, 0])
}


function selectBetween(x, range) {
	if (range == "all") {
		return true
	} else {
		return x >= range[0] && x <= range[1]
	}
}

function isInSelection(x, celltypes) {
	if (celltypes.length == 0) {
		return true
	} else {
		return celltypes.indexOf(x) != -1
	}
}

// how to
function filterDataToSelection(data, selection) {
	return data.filter(function(d) {
		return selectBetween(d.foldEnrichment, selection.fold) &&
		selectBetween(d.meanTPM, selection.enrich) && isInSelection(d.enrichedIn, selection.downstreamCellTypes)
	})
}


// base selection
var selection = {
	"brush": 0,
	"enrich": [],
	"fold": [],
	"cellTypes": [],
	"downstreamCellTypes": [],
	"genes": []
}

// TODO: populate this in a more automated way
var downstreamTypes = {
	"POMC neuron": ["POMC neuron"],
	"Aldh1l1 astrocyte": ["Aldh1l1 astrocyte"],
	"Lhx5 hypothalamic interneuron": ["Lhx5 hypothalamic interneuron"],
	"AGRP neuron": ["AGRP neuron"],
	"ChAT neuron": ["ChAT neuron"],
	"myelinating oligodendrocyte": ["myelinating oligodendrocyte"],
	"oligodendrocyte precursor": ["oligodendrocyte precursor"],
	"Glt25d2 pyramidal neuron": ["Glt25d2 pyramidal neuron"],
	"neuron": ["neuron", "Glt25d2 pyramidal neuron", "pyramidal neuron", "projection neuron", "S100a10 pyramidal neuron", "callosal projection neuron", "subcerebral projection neuron", "corticothalamic projection neuron", "AGRP neuron", "AGRP projection neuron", "POMC neuron", "POMC projection neuron", "Lhx5 hypothalamic interneuron", "inhibitory interneuron", "interneuron", "Stard8 neuron", "dopaminergic neuron", "Lhx5 midbrain interneuron", "SNpc dopaminergic neuron", "VTA dopaminergic neuron", "Drd1 neuron", "medium spiny neuron", "Drd2 neuron", "ChAT neuron", "cholinergic neuron", "Slc17a6 neuron", "periglomerular neuron", "Cbln1 neuron", "granule cell", "Epyc neuron", "GABAergic neuron", "Chrna5 neuron"],
	"oligodendrocyte": ["oligodendrocyte", "oligodendrocyte precursor", "newly formed oligodendrocyte", "myelinating oligodendrocyte"],
	"microglia": ["microglia"],
	"Stard8 neuron": ["Stard8 neuron"],
	"dopaminergic neuron": ["dopaminergic neuron", "Stard8 neuron", "SNpc dopaminergic neuron", "VTA dopaminergic neuron"],
	"VTA dopaminergic neuron": ["VTA dopaminergic neuron"],
	"subcerebral projection neuron": ["subcerebral projection neuron"],
	"medium spiny neuron": ["medium spiny neuron", "Drd1 neuron", "Drd2 neuron"],
	"corticothalamic projection neuron": ["corticothalamic projection neuron"],
	"Dcdc2a ependymal": ["Dcdc2a ependymal"],
	"inhibitory interneuron": ["inhibitory interneuron", "Lhx5 hypothalamic interneuron"],
	"periglomerular neuron": ["periglomerular neuron", "Slc17a6 neuron"],
	"projection neuron": ["projection neuron", "Glt25d2 pyramidal neuron", "pyramidal neuron", "S100a10 pyramidal neuron", "callosal projection neuron", "subcerebral projection neuron", "corticothalamic projection neuron", "AGRP neuron", "AGRP projection neuron", "POMC neuron", "POMC projection neuron", "Stard8 neuron", "dopaminergic neuron", "SNpc dopaminergic neuron", "VTA dopaminergic neuron", "Drd1 neuron", "medium spiny neuron", "Drd2 neuron", "ChAT neuron", "cholinergic neuron", "Epyc neuron", "GABAergic neuron", "Chrna5 neuron"],
	"cholinergic neuron": ["cholinergic neuron", "ChAT neuron"],
	"Cbln1 neuron": ["Cbln1 neuron"],
	"Lhx5 midbrain interneuron": ["Lhx5 midbrain interneuron"],
	"GABAergic neuron": ["GABAergic neuron", "Epyc neuron", "Chrna5 neuron"],
	"Epyc neuron": ["Epyc neuron"],
	"endothelial": ["endothelial", "Abcb1a blood vessel"],
	"callosal projection neuron": ["callosal projection neuron"],
	"pyramidal neuron": ["pyramidal neuron", "Glt25d2 pyramidal neuron", "S100a10 pyramidal neuron", "callosal projection neuron", "subcerebral projection neuron", "corticothalamic projection neuron"],
	"glia": ["glia", "oligodendrocyte precursor", "oligodendrocyte", "newly formed oligodendrocyte", "myelinating oligodendrocyte", "microglia", "astrocyte", "Aldh1l1 astrocyte", "Abcb1a blood vessel", "endothelial", "Dcdc2a ependymal", "ependymal"],
	"Chrna5 neuron": ["Chrna5 neuron"],
	"Abcb1a blood vessel": ["Abcb1a blood vessel"],
	"ependymal": ["ependymal", "Dcdc2a ependymal"],
	"newly formed oligodendrocyte": ["newly formed oligodendrocyte"],
	"granule cell": ["granule cell", "Cbln1 neuron"],
	"AGRP projection neuron": ["AGRP projection neuron", "AGRP neuron"],
	"Drd2 neuron": ["Drd2 neuron"],
	"SNpc dopaminergic neuron": ["SNpc dopaminergic neuron"],
	"Slc17a6 neuron": ["Slc17a6 neuron"],
	"astrocyte": ["astrocyte", "Aldh1l1 astrocyte"],
	"Drd1 neuron": ["Drd1 neuron"],
	"POMC projection neuron": ["POMC projection neuron", "POMC neuron"],
	"S100a10 pyramidal neuron": ["S100a10 pyramidal neuron"],
	"interneuron": ["interneuron", "Lhx5 hypothalamic interneuron", "inhibitory interneuron", "Lhx5 midbrain interneuron", "Slc17a6 neuron", "periglomerular neuron"]
}

function expandToDownstream(cellTypes) {

	var downstream = [];
	// and update downstream selectors
	cellTypes.forEach(function(cellType) {
		downstream = downstream.concat(downstreamTypes[cellType])
	})
	return d3.set(downstream).values();
}

// set up custom events
var dispatch = d3.dispatch("extentChanged", "updateCellTypeSelection", "updateViewCellType");


// use hash fragment from URL to set selection state
if (window.location.hash.split("&").length != 0) {
	var windowState = window.location.hash.split("&");
	for (var i = 0; i < windowState.length; i++) {
		var k = windowState[i].replace('#', '').split('=');
		if (k[0] == "enrich") {
			selection.enrich = [+k[1].split(",")[0], +k[1].split(",")[1]];
		} else if (k[0] == "fold") {
			selection.fold = [+k[1].split(",")[0], +k[1].split(",")[1]];
		} else if (k[0] == "celltypes") {
			var cells = []
			if (k[1] != "") {
				k[1].split(",").forEach(function(cell) {
					cells.push(cell)
				})
			}
			selection.cellTypes = cells
			selection.downstreamCellTypes = expandToDownstream(selection.cellTypes)
		} else if (k[0] == "brush") {
			selection.brush = +k[1]
		}
	}
}

// STANDARD SVG SETUP
var svg = d3.select('#navChart')
.append('svg')
.attr('width', width + margin.left + margin.right)
.attr('height', height + margin.top + margin.bottom)
.append('g')
.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// set up legend tree
var tree = {}
var treeData = window._PreLoadExploreTreeData;

tree = treeLegend().setDispatcher(dispatch).setSelectedTypes(selection.cellTypes)
svg.append("g")
.attr("transform", "translate(" + 600 + "," + margin.top + ")")
.datum(treeData).call(tree)



var mouseData = window._PreLoadExploreGeneData;
// set up scatterplot
var scatter = scatterSelector()
svg.append("g").classed("dataPoints", true)
.datum(mouseData).call(scatter);

// set up table
var table = tableChart().setSelectedGenes(selection.genes)
d3.select(".myTable").datum(filterDataToSelection(mouseData, selection)).call(table)

dispatch.extentChanged(selection)

// set up dispatchers
dispatch.on("extentChanged.table", function(selection) {
	table.updateData(filterDataToSelection(mouseData, selection))
})

dispatch.on("updateCellTypeSelection", function(cellType) {

	// update cell types
	var index = selection.cellTypes.indexOf(cellType);
	if (index == -1) {
		selection.cellTypes.push(cellType)
	} else {
		selection.cellTypes.splice(index, 1)
	}
	selection.downstreamCellTypes = expandToDownstream(selection.cellTypes)
	dispatch.updateViewCellType(selection)
})

dispatch.on("updateViewCellType", function(selection) {
	// update tree
	tree.showSelections();

	// update hash
	updateHash(selection);

	// update table data
	table.updateData(filterDataToSelection(mouseData, selection))

	scatter.updateSelections(selection.downstreamCellTypes)

})
dispatch.updateViewCellType(selection)


// update hash when extents change
dispatch.on("extentChanged.URL", updateHash)


function updateHash(selection) {
	window.location.hash = "celltypes=" + selection.cellTypes + "&brush=" + selection.brush;
	if (selection.brush) {
		window.location.hash = window.location.hash + "&enrich=" + selection.enrich[0] + "," + selection.enrich[1] + "&fold=" + selection.fold[0] + "," + selection.fold[1]
	}
}
