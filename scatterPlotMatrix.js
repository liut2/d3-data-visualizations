// Credits: I used Eric's lab's code as the starter template for this assignment.
// Also, I used one random color generator function found online at http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
// CS 314, Spring 2017
// author: Tao Liu


// First, we will create some constants to define non-data-related parts of the visualization
var w = 2000;			// Width of our visualization
var h = 2000;			// Height of our visualization
var margin = 50;		// Margin around visualization
var vals = ['Rank','Frequency','TFIDF','DocFrequency'];
var gridLength = 150;   // The size of each individual plot
var svg; // The canvas We draw things on


// Next, we will load in our CSV of data
d3.csv('shakespeare_top30.csv', function(csvData) {
	var data = csvData;
	// Next, we will create an SVG element to contain our visualization.
	svg = d3.select('#pointsSVG').append('svg:svg')
				.attr('width', w)
				.attr('height', h);

	// Here I treat the data as n * n matrix to automatically plot all the combinations of x and y values
	for (var i = 0; i < vals.length; i++) {
		for (var j = 0; j < vals.length; j++) {
			// If it's not diagonal, we plot it
			if (i != j) {
				createPlot(data, i, j);
			} else {
				// Otherwise, add labels here
				var labels = svg.append('g')
					.attr('transform', 'translate(' + (gridLength * j + margin * (j + 1) +  gridLength / 4) + ',' + (gridLength * i + margin * i + gridLength / 2) + ')')
					.append('text')
					.text(vals[i])
					.style('font-size', '15px')
					.style('font-weight', 'bold');
			}
		}
	}

});

// This function contains the real meat of plotting the data
function createPlot(data, i, j) {
	var xVal = vals[j];
	var yVal = vals[i];

	// This will define scales that convert values
	// from our data domain into screen coordinates.
	xScale = d3.scale.linear()
				.domain([d3.min(data, function(d) { return parseFloat(d[xVal]); })-1,
						 d3.max(data, function(d) { return parseFloat(d[xVal]); })+1])
				.range([0, gridLength]);
	yScale = d3.scale.linear()
				.domain([d3.min(data, function(d) { return parseFloat(d[yVal]); })-1,
						 d3.max(data, function(d) { return parseFloat(d[yVal]); })+1])
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

	yAxis = d3.svg.axis()
				.scale(yScale)
				.orient('left')
				.ticks(5);
	yAxisG = svg.append('g')
				.attr('class', 'axis')
				.attr('transform', 'translate(' + (gridLength * j + margin * (j + 1)) + ',' + (gridLength * i + margin * i) + ')')
				.call(yAxis);

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
		.attr('class', function(d) {return 'item-' + d['Word']})
		.attr('cx', function(d) {return gridLength * j + margin * (j + 1) + xScale(d[xVal]); })
		.attr('cy', function(d) {return gridLength * i + margin * i + yScale(d[yVal]); })
		.attr('r', 3)
		.style('fill', 'lightgrey')
		.on('mouseover', function(d) {
			var className = 'item-' + d3.select(this).select('title').text();
			var isClicked = d3.select(this).attr('class').includes(className + '-clicked');

			if (!isClicked) {
				d3.selectAll('.' + className)
					.style('fill', 'red');
			}
		})
		.on('mouseout', function(d) {
			var className = 'item-' + d3.select(this).select('title').text();
			var isClicked = d3.select(this).attr('class').includes(className + '-clicked');

			if (!isClicked) {
				d3.selectAll('.' + className)
					.style('fill', 'lightgrey');
			}
		})
		.on('click', function(d) {
			var className = 'item-' + d3.select(this).select('title').text();
			var isClicked = d3.select(this).attr('class').includes(className + '-clicked');

			if (isClicked) {
				d3.selectAll('.' + className)
					.style('fill', 'lightgrey')
					.classed('.' + className + '-clicked', false);
			} else {
				d3.selectAll('.' + className)
					.style('fill', getRandomColor())
					.classed('.' + className + '-clicked', true);
			}

		})
		.append('svg:title')
		.text(function(d) {return d['Word']; });
}

// This function generates random color
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
