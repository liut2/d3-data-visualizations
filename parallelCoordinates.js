// Credits: I used Eric's lab's code as the starter template for this assignment.
// Also, I used one random color generator function found online at http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
// and this tutorial on how to draw a line in d3 at https://www.dashingd3js.com/svg-paths-and-d3js
// CS 314, Spring 2017
// author: Tao Liu


// First, we will create some constants to define non-data-related parts of the visualization
var w = 2000;			// Width of our visualization
var h = 2000;			// Height of our visualization
var margin = 200;		// Margin around visualization
var marginTop = 20;
var vals = ['Rank','Frequency','TFIDF','DocFrequency'];
var axisLength = 400;
var svg; // The canvas We draw things on


// Next, we will load in our CSV of data
d3.csv('shakespeare_top30.csv', function(csvData) {
	var data = csvData;
	// Next, we will create an SVG element to contain our visualization.
	svg = d3.select('#pointsSVG').append('svg:svg')
				.attr('width', w)
				.attr('height', h);

  // Plot points on each y-axis
  for (var i = 0; i < vals.length; i++) {
    createPlot(data, i);
  }

  // Connect points of the same item
  /*
  for (var i = 0; i < data.length; i++) {
    var word = data[i]['Word'];
    var className = 'item-' + word;
    if (i == 0) {
      var circles = svg.selectAll('.' + className)[0];
      for (var j = 0; j < circles.length; j++) {

      }
    }
  }*/
  var lineData;
  for (var i = 0; i < data.length; i++) {
    lineData = [];
    for (var j = 0; j < vals.length; j++) {
      var point = {};
      point['x'] = margin * (j + 1);

      var yScale = d3.scale.linear()
    				.domain([d3.min(data, function(d) { return parseFloat(d[vals[j]]); })-1,
    						 d3.max(data, function(d) { return parseFloat(d[vals[j]]); })+1])
    				.range([axisLength, 0]); // Notice this is backwards!

      point['y'] = marginTop + yScale(data[i][vals[j]]);
      lineData.push(point);
    }

    var lineFunction = d3.svg.line()
      .x(function(d) { return d['x']; })
      .y(function(d) { return d['y']; })
      .interpolate("linear");

    //The line SVG Path we draw
    var lineGraph = svg.append("path")
      .attr("d", lineFunction(lineData))
      .attr("stroke", "lightgrey")
      .attr("stroke-width", 2)
      .attr("fill", "none");

  }

});

// This function contains the real meat of plotting the data
function createPlot(data, i) {
	var yVal = vals[i];

	// This will define scales that convert values
	// from our data domain into screen coordinates.
	var yScale = d3.scale.linear()
				.domain([d3.min(data, function(d) { return parseFloat(d[yVal]); })-1,
						 d3.max(data, function(d) { return parseFloat(d[yVal]); })+1])
				.range([axisLength, 0]); // Notice this is backwards!

	// Build axes! (These are kind of annoying, actually...)
	var yAxis = d3.svg.axis()
				.scale(yScale)
				.orient('left')
				.ticks(5);
	var yAxisG = svg.append('g')
				.attr('class', 'axis')
				.attr('transform', 'translate(' + (margin * (i + 1)) + ',' + marginTop + ')')
				.call(yAxis);
  var yLabel = svg.append('text')
        .attr('class','label')
        .attr('x', margin * (i + 1))
        .attr('y', 10)
        .text(yVal);

	// Select elements
	// Bind data to elements
	var plotId = i;
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
		.attr('cx', function(d) {return margin * (i + 1); })
		.attr('cy', function(d) {return marginTop + yScale(d[yVal]); })
		.attr('r', 3)
		.style('fill', 'lightgrey');
    /*
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
    */
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
