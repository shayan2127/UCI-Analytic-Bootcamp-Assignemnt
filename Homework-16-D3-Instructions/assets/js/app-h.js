// @TODO: YOUR CODE HERE!

//The code for the chart is wrapped inside a function that automatically resizes the chart
function shayanAssignment() {

	//if the SVG area isn't empty when the browser loads, remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");

    // clear svg if it is not empty
    if (!svgArea.empty()) {
        svgArea.remove();
    }

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
	    .attr("height", svgHeight)
	    .attr("class", "chart");

	// Append an SVG group
	var chartGroup = svg.append("g")
	    .attr("transform", `translate(${margin.left}, ${margin.top})`);

	// Initial Params
	var chosenXAxis = "poverty";
	var chosenYAxis = "healthcare";

	// function used for updating x-scale var upon click on axis label
	function xScale(homeworkData, chosenXAxis) {
	    // create scales
	    var xLinearScale = d3.scaleLinear()
	    	.domain([d3.min(homeworkData, d => d[chosenXAxis]) * 0.8, d3.max(homeworkData, d => d[chosenXAxis]) * 1.2])
	    	.range([0, width]);

	    return xLinearScale;
	}

	// function used for updating y-scale var upon click on axis label
	function yScale(homeworkData, chosenYAxis) {
	    // create scales
	    var yLinearScale = d3.scaleLinear()
	    	.domain([d3.min(homeworkData, d => d[chosenYAxis]) * 0.8, d3.max(homeworkData, d => d[chosenYAxis]) * 1.2])
	    	.range([0, width]);

	    return yLinearScale;
	}

	// function used for updating xAxis var upon click on axis label
	function renderXAxes(newXScale, xAxis) {
	    var bottomAxis = d3.axisBottom(newXScale);

	    xAxis.transition()
		    .duration(1000)
		    .call(bottomAxis);

	    return xAxis;
	}
	// function used for updating yAxis var upon click on axis label
	function renderYAxes(newYScale, yAxis) {
	    var leftAxis = d3.axisBottom(newYScale);

	    yAxis.transition()
		    .duration(1000)
		    .call(leftAxis);

	    return yAxis;
	}

	// function used for updating circles group with a transition to new circles
	function renderCircles(circlesGroup, newXScale, chosenXaxis, newYScale, chosenYaxis) {

	    circlesGroup.transition()
		    .duration(1000)
		    .attr("cx", d => newXScale(d[chosenXAxis]))
		    .attr("cy", d => newYScale(d[chosenYAxis]));

	    return circlesGroup;
	}

	// function used for updating circles group with new tooltip
	function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

	    if (chosenXAxis === "poverty") {
	    	var xlabel = "In Poverty (%)";
	    }
	    else if (chosenXAxis === "age"){
	    	var xlabel = "Age (Median)";
	    }
	    else{
	    	var xlabel = "Household Income (Median)";
	    }

	    if (chosenYAxis === "obesity") {
	    	var ylabel = "Obesity (%)";
	    }
	    else if (chosenYAxis === "smokes"){
	    	var ylabel = "Smokes (%)";
	    }
	    else{
	    	var ylabel = "Lacks Healthcare(%)";
	    }

	    var toolTip = d3.tip()
		    .attr("class", "tooltip")
		    .offset([80, -60])
		    .html(function(d) {
		      return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
	    });

	    circlesGroup.call(toolTip);

	    circlesGroup
	    // onmouseover event
	    	.on("mouseover", function(d) {toolTip.show(d);
	    })
	    // onmouseout event
	    	.on("mouseout", function(d, i) {toolTip.hide(d);
	    });

	  return circlesGroup;
	}

	// Retrieve data from the CSV file and execute everything below
	d3.csv("assets/data/data.csv", function(err, homeworkData) {
  		if (err) throw err;

	  	// parse data
		homworkData.forEach(function(data) {
		    data.poverty = +data.poverty;
		    data.age = +data.age;
		    data.income = +data.income;
		    data.obesity = +data.obesity;
		    data.smokes = +data.smokes;
		    data.healthcare = +data.healthcare;
		});

		// xLinearScale function above csv import
		var xLinearScale = xScale(homeworkData, chosenXAxis);

		// yLinearScale function above csv import
		var yLinearScale = yScale(homeworkData, chosenYAxis);

		// Create initial axis functions
		var bottomAxis = d3.axisBottom(xLinearScale);
		var leftAxis = d3.axisLeft(yLinearScale);

		// append x axis
		var xAxis = chartGroup.append("g")
		    .attr("transform", `translate(0, ${height})`)
		    .call(bottomAxis);

		// append y axis
		var yAxis = chartGroup.append("g")
		    .call(leftAxis);

		// append initial circles
		var circlesGroup = chartGroup.selectAll("circle")
		    .data(homeworkData)
		    .enter()
		    .append("circle")
		    .attr("cx", d => xLinearScale(d[chosenXAxis]))
		    .attr("cy", d => yLinearScale(d[chosenYAxis]))
		    .attr("r", 20)
		    .attr("fill", "lightblue")
		    .attr("opacity", ".5");

		// Create group for  labels
		var labelsGroup = chartGroup.append("g")
		    .attr("transform", `translate(${width / 2}, ${height + 20})`);

		var povertyLabel = labelsGroup.append("text")
		    .attr("x", 0)
		    .attr("y", 20)
		    .attr("value", "poverty") // value to grab for event listener
		    .classed("active", true)
		    .text("In Poverty(%)");

		var ageLabel = labelsGroup.append("text")
		    .attr("x", 0)
		    .attr("y", 40)
		    .attr("value", "age") // value to grab for event listener
		    .classed("inactive", true)
		    .text("Age (Median)");

		var incomeLabel = labelsGroup.append("text")
		    .attr("x", 0)
		    .attr("y", 60)
		    .attr("value", "income") // value to grab for event listener
		    .classed("inactive", true)
		    .text("Household Income (Median)");

		var obesityLabel = labelsGroup.append("text")
		    .attr("x", 0 - (height / 2))
		    .attr("y", 0 - margin.left)
		    .attr("value", "obesity") // value to grab for event listener
		    .attr("dy", "1em")
		    .classed("active", true)
		    .classed("aText", true)
		    .text("Obesity (%)");

		var smokesLabel = labelsGroup.append("text")
		    .attr("x", 0 - (height / 2))
		    .attr("y", 20 - margin.left)
		    .attr("value", "smokes") // value to grab for event listener
		    .attr("dy", "1em")
		    .classed("inactive", true)
		    .classed("aText", true)
		    .text("Smokes (%)");

		var incomeLabel = labelsGroup.append("text")
		    .attr("x", 0 - (height / 2))
		    .attr("y", 40 - margin.left)
		    .attr("dy", "1em")
		    .attr("value", "healthcare") // value to grab for event listener
		    .classed("inactive", true)
		    .classed("aText", true)
		    .text("Lacks Healthcare(%)");

		// updateToolTip function above csv import
  		var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

		// x and y axis labels event listener
		labelsGroup.selectAll("text")
		    .on("click", function() {
		        // get value of selection
		        var xValue = d3.select(this).attr("value");
		        if (xValue !== chosenXAxis) {

		        	// replaces chosenXAxis with value
		        	chosenXAxis = xValue;

		        	// functions here found above csv import updates x scale for new data
			        xLinearScale = xScale(homeworkData, chosenXAxis);

			        // updates x axis with transition
			        xAxis = renderXAxes(xLinearScale, xAxis);

			        // updates circles with new x values
			        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

			        // updates tooltips with new info
			        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

			        // changes classes to change bold text
			        if (chosenXAxis === "poverty") {
			            povertyLabel
				            .classed("active", true)
				            .classed("inactive", false);
			            ageLabel
				            .classed("active", false)
				            .classed("inactive", true);
			            incomeLabel
				            .classed("active", false)
				            .classed("inactive", true);			            
			        }
			        else if (chosenXAxis === "age") {
			            povertyLabel
				            .classed("active", false)
				            .classed("inactive", true);
			            ageLabel
				            .classed("active", true)
				            .classed("inactive", false);
			            incomeLabel
				            .classed("active", false)
				            .classed("inactive", true);			            
			        }

			        else {
			            povertyLabel
				            .classed("active", false)
				            .classed("inactive", true);
			            ageLabel
				            .classed("active", false)
				            .classed("inactive", true);
			            incomeLabel
				            .classed("active", true)
				            .classed("inactive", false);	            
			        }
		    	}

		    	var yValue = d3.select(this).attr("value");
		        if (yValue !== chosenYAxis) {

		        	// replaces chosenYAxis with value
		        	chosenXAxis = yValue;

		        	// functions here found above csv import updates y scale for new data
			        yLinearScale = yScale(homeworkData, chosenYAxis);

			        // updates x axis with transition
			        yAxis = renderYAxes(yLinearScale, yAxis);

			        // updates circles with new x values
			        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

			        // updates tooltips with new info
			        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

			        // changes classes to change bold text
			        if (chosenXAxis === "obesity") {
			            obesityLabel
				            .classed("active", true)
				            .classed("inactive", false);
			            smokesLabel
				            .classed("active", false)
				            .classed("inactive", true);
			            healthcareLabel
				            .classed("active", false)
				            .classed("inactive", true);			            
			        }
			        else if (chosenXAxis === "smokes") {
			            obesityLabel
				            .classed("active", false)
				            .classed("inactive", true);
			            smokesLabel
				            .classed("active", true)
				            .classed("inactive", false);
			            healthcareLabel
				            .classed("active", false)
				            .classed("inactive", true);			            
			        }
			        else {
			            obesityLabel
				            .classed("active", false)
				            .classed("inactive", true);
			            smokesLabel
				            .classed("active", false)
				            .classed("inactive", true);
			            healthcareLabel
				            .classed("active", true)
				            .classed("inactive", false);            
			        }		    		

		    	}

		});

	});

}

// When the browser loads, shayanAssignment() is called.
shayanAssignment();

// When the browser window is resized, shayanAssignment() is called.
d3.select(window).on("resize", shayanAssignment);
