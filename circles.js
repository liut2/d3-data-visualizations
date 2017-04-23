var circles = d3.selectAll('circle')
  .data([[10,20], [20, 30], [30, 40]]);

circles
  .style('fill', 'steelblue')
  .attr('r', 20)
  .attr('cx', function(d) {return d[0]; })
  .attr('cy', function(d) {return d[1]; });
