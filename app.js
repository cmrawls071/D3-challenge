var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(censusData) {
  console.log(censusData[0])

  // Parse Data/Cast as numbers
  // ==============================
  censusData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.obesity = +data.obesity;
    // data.age = +data.age;
    // data.income = +data.income;
    // data.healthcare = +data.healthcare;
    // data.smokes = +data.smokes;
  });

  // Set the scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.poverty)-1, d3.max(censusData, d => d.poverty)+1])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.obesity)-1, d3.max(censusData, d => d.obesity)+1])
    .range([height, 0]);

  // Create axes
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append the axes to the chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  // Initialize the tool tip
  var div = d3.select("body").append("div")	
  .attr("class", "tooltip")				
  .style("opacity", 0);

  // Create the circles
chartGroup.selectAll("circle")	
    .data(censusData)
    .enter()
    .append("circle")			
    .attr("r", 12)		
    .attr("cx", d => xLinearScale(d.poverty))		 
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("fill", "blue")
    .attr("opacity", ".5")
    
    
    // add the tool tip functionality to the circles
    .on("mouseover", function(d) {		
        div.transition()		
            .duration(100)		
            .style("opacity", .9);		
        div	.html(`${d.state}<br>% in Poverty: ${d.poverty}<br>% Obese: ${d.obesity}`)	
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 28) + "px");	
        })					
    .on("mouseout", function(d) {
      div.transition()		
        .duration(100)		
        // .style("opacity", 0);
      });

    // Add state labels to each circle
    var text = chartGroup.selectAll("g")
    .data(censusData)
    .enter()
    .append("g");

    text.append("text")
        .text(d => d.abbr)
        .attr("dx", (d => xLinearScale(d.poverty)-7))
        .attr("dy", (d => yLinearScale(d.obesity)+5))
        .attr("font-size", 10)
        .style('fill', 'white')
        .style("text-align","center")

    // Create axis labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 1.4))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("% of Population that is Obese");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("% of People in Poverty");
  }).catch(function(error) {
    console.log(error);
  });