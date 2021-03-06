// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 500;

var margin = {
	top: 20,
	right: 40,
	bottom: 80,
	left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
	.select("#scatter")
	.append("svg")
	.attr("width", svgWidth)
	.attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
	.attr("transform", `translate(${margin.left}, ${margin.top})`);

// Retrieve data from the CSV file and execute everything below

d3.csv("assets/data/data.csv", function(hwd) {

	console.log(hwd);

	// parse data
	hwd.forEach(function(d) {
	    d.poverty = +d.poverty;
	    d.healthcare = +d.healthcare;
	  });

	// xLinearScale function above csv import
	var xLinearScale = d3.scaleLinear()
		.domain([d3.min(hwd, data => data.poverty) - 1, d3.max(hwd, data => data.poverty) + 1])
		.range([0, width]);


	// yLinearScale function above csv import
	var yLinearScale = d3.scaleLinear()
		.domain([d3.min(hwd, data => data.healthcare) - 1.4, d3.max(hwd, data => data.healthcare) + 4])
		.range([height, 0]);

	// Create initial axis functions
	var bottomAxis = d3.axisBottom(xLinearScale);
	var leftAxis = d3.axisLeft(yLinearScale);

	// append x axis
	chartGroup.append("g")
		.attr("transform", `translate(0, ${height})`)
		.call(bottomAxis);

	// append y axis
	chartGroup.append("g")
		.call(leftAxis);

	// append initial circles
	var circlesGroup = chartGroup.selectAll("circle")
		.data(hwd)
		.enter()
		.append("circle")
		.attr("cx", d => xLinearScale(d.poverty))
		.attr("cy", d => yLinearScale(d.healthcare))
		.attr("r", 20)
		.attr("fill", "blue")
		.attr("opacity", ".5");

    // Tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([8, 0])
        .html(function(d) {
        	return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
     	});

    // Create the tooltip in chartGroup.
    chartGroup.call(toolTip);

    // Create "mouseover" event listener to display tooltip
    circlesGroup.on("mouseover", function(d) {
    	d3.select(this).style("stroke", "green")
        toolTip.show(d, this);
      })
    // Create "mouseout" event listener to hide tooltip
        .on("mouseout", function(d) {
        toolTip.hide(d);
       	});

	chartGroup.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin.left + 20)
		.attr("x", 0 - (height / 2))
		.attr("dy", "1em")
		.attr("class", "aText")
		.text("Lacks Healthcare (%)");

	chartGroup.append("text")
		.attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
		.attr("class", "axisText")
		.text("In Poverty (%)");

});