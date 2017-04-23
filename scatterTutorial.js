// Part of a brief D3 tutorial.
// Upon completion, will display an interactive scatterplot showing relationship between
//   different values associated with the top 100 words in Shakespeare's First Folio
// CS 314, Spring 2017
// Eric Alexander
// TODO: add diagonal labels, title, interactivity and change data

// First, we will create some constants to define non-data-related parts of the visualization
var w = 2000;			// Width of our visualization
var h = 2000;			// Height of our visualization
//xOffset = 40;		// Space for x-axis labels
//yOffset = 100;		// Space for y-axis labels
var margin = 50;		// Margin around visualization
var vals = ['Rank','Frequency','TFIDF','DocFrequency'];
//xVal = vals[0];		// Value to plot on x-axis
//yVal = vals[1];		// Value to plot on y-axis
var gridLength = 150;
var svg;


// Next, we will load in our CSV of data
d3.csv('shakespeare_top100.csv', function(csvData) {
	var data = csvData;
	// Next, we will create an SVG element to contain our visualization.
	svg = d3.select('#pointsSVG').append('svg:svg')
				.attr('width', w)
				.attr('height', h);

	for (var i = 0; i < vals.length; i++) {
		for (var j = 0; j < vals.length; j++) {
			if (i != j) {
				createPlot(data, i, j);
			} else {
				// Add labels here
				var labels = svg.append('g')
					.attr('transform', 'translate(' + (gridLength * j + margin * (j + 1) +  gridLength / 4) + ',' + (gridLength * i + margin * i + gridLength / 2) + ')')
					.append('text')
					.text(vals[i])
					.style('font-size', '15px');
			}
		}
	}

});

/*
// A function to retrieve the next value in the vals list
function getNextVal(val) {
	return vals[(vals.indexOf(val) + 1) % vals.length];
}

// A function to change what values we plot on the x-axis
function setXval(val) {
	// Update xVal
	xVal = val;

	// Update the axis
	xScale.domain([d3.min(data, function(d) { return parseFloat(d[xVal]); })-1,
				   d3.max(data, function(d) { return parseFloat(d[xVal]); })+1])
	xAxis.scale(xScale);
	xAxisG.call(xAxis);
	xLabel.text(xVal);

	// Update the points
	// ************************************************
	// *********** YOUR CODE WILL GO HERE **************
	// ************************************************
	circles = svg.selectAll('circle');
	circles
		.attr('cx', function(d) {return xScale(d[xVal]); });
}

// A function to change what values we plot on the y-axis
function setYval(val) {
	// Update yVal
	yVal = val;

	// Update the axis
	yScale.domain([d3.min(data, function(d) { return parseFloat(d[yVal]); })-1,
				   d3.max(data, function(d) { return parseFloat(d[yVal]); })+1])
	yAxis.scale(yScale);
	yAxisG.call(yAxis);
	yLabel.text(yVal);

	// Update the points
	// ************************************************
	// *********** YOUR CODE WILL GO HERE *************
	// ************************************************
	circles = svg.selectAll('circle');
	circles
		.attr('cy', function(d) {return yScale(d[yVal]); });
}
*/
function createPlot(data, i, j) {
	var xVal = vals[j];
	var yVal = vals[i];

	// This will define scales that convert values
	// from our data domain into screen coordinates.
	xScale = d3.scale.linear()
				.domain([d3.min(data, function(d) { return parseFloat(d[xVal]); })-1,
						 d3.max(data, function(d) { return parseFloat(d[xVal]); })+1])
				//.range([yOffset + margin, w - margin]);
				.range([0, gridLength]);
	yScale = d3.scale.linear()
				.domain([d3.min(data, function(d) { return parseFloat(d[yVal]); })-1,
						 d3.max(data, function(d) { return parseFloat(d[yVal]); })+1])
				//.range([h - xOffset - margin, margin]); // Notice this is backwards!
				.range([gridLength, 0]); // Notice this is backwards!

	// Build axes! (These are kind of annoying, actually...)
	xAxis = d3.svg.axis()
				.scale(xScale)
				.orient('bottom')
				.ticks(5);
	xAxisG = svg.append('g')
				.attr('class', 'axis')
				.attr('transform', 'translate(' + (gridLength * j + margin * (j + 1)) + ',' + (gridLength * (i + 1) + margin * i) + ')')
				.call(xAxis);
	/*
	xLabel = svg.append('text')
				.attr('class','label')
				.attr('x', gridLength/2)
				.attr('y', gridLength - 20)
				.text(xVal);*/

	yAxis = d3.svg.axis()
				.scale(yScale)
				.orient('left')
				.ticks(5);
	yAxisG = svg.append('g')
				.attr('class', 'axis')
				.attr('transform', 'translate(' + (gridLength * j + margin * (j + 1)) + ',' + (gridLength * i + margin * i) + ')')
				.call(yAxis);
	/*
	yLabel = svg.append('text')
				.attr('class','label')
				.attr('x', 0)
				.attr('y', gridLength/2)
				.text(yVal);*/

	// Select elements
	// Bind data to elements
	var plotId = vals.length * i + j;
	circles = svg.selectAll('.dot' + plotId)
		.data(data);

	// Create new elements if needed
	// Update our selection
		// Give it a class
		// x-coordinate
		// y-coordinate
		// radius
		// color
		// tooltip
	circles.enter()
		.append('svg:circle')
		.attr('class', 'dot' + plotId)
		.attr('cx', function(d) {return gridLength * j + margin * (j + 1) + xScale(d[xVal]); })
		.attr('cy', function(d) {return gridLength * i + margin * i + yScale(d[yVal]); })
		.attr('r', 3)
		.style('fill', 'lightgrey')
		//.append('svg:title')
		//.text(function(d) {return d['Rank']; });
}
