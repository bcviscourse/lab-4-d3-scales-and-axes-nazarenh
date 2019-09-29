function print(x){
	console.log(x);
}

function arvalues(start,end, interval, order){
	ar=[]
	// nice= [10,100,1000,10000,100000,1000000,10000000, 100000000, 1000000000, 10000000000, 100000000000,1000000000000]
	start = Math.round(start/order) *order ;
	end= Math.round(end/order) *order;
	for (let i =start; i< end+order; i= i+interval){
		ar.push(i);
	}
	return ar;
}

// print(arvalues(6,200,3,10));

// SVG Size
var width = 700,
	height = 500;


// Load CSV file

d3.csv("data/wealth-health-2014.csv")
	.then(data=>{

				// Margin object with properties for the four directions
		let margin = {top: 20, right: 10, bottom: 20, left: 10};

		// Width and height as the inner dimensions of the chart area
		let width = 960 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom;

		// Define 'svg' as a child-element (g) from the drawing area and include spaces
		let svg = d3.select("body").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


			// type conversion string to int:
			data.forEach(row => {
				row.LifeExpectancy = +row.LifeExpectancy;
				row.Income= +row.Income;
				row.Population = +row.Population;
				});


					//sorts:
		data.sort(function(a, b) {
			return parseFloat(b.Population) - parseFloat(a.Population);
		});

		//makes color palette according to region:
		let colorPalette = d3.scaleOrdinal(d3.schemeAccent);
		function makeCategories(data) {
			ar=[];
			data.forEach(function(d){
				if (!ar.includes(d.Region)){
					ar.push(d.Region);
				}
			})
			return ar;
		}

		cats= makeCategories(data);
		colorPalette.domain(cats);




		//radius function:
		let PopRange = d3.extent(data, (d) => d.Population);
		var radScale = d3.scaleLinear()
			.domain([PopRange[0], PopRange[1]])
			.range([4, 30]);
		print(PopRange);



			// // Add svg element to HTML element with id #chart-area:
			// let svg = d3.select("#chart-area").append("svg")
			// 	.attr("height", height)
			// 	.attr("width", width)
			// 	.attr("class", "svg")
		

			//find min and max of income and lifeexpectancy:
			let IncRange= d3.extent(data, (d) => d.Income );
			let LifeRange = d3.extent(data, (d) => d.LifeExpectancy);




			//create income and life expectancy scales:
			// var adjustxscale = 10000;
			var incomeScale = d3.scaleLog()
				.domain([IncRange[0], IncRange[1]])
				.range([50, width-60]);
			
			// var adjustyscale= 5;
			var lifeExpectancyScale = d3.scaleLog()
				.domain([LifeRange[0]-5, LifeRange[1]+5])
				.range([height-50, 50]);




			//show income axis at the bottom of the graph:
			var xAxis = d3.axisBottom(incomeScale)
				.tickValues([IncRange[0],1250,2500,5000,10000,20000, 50000,80000,130000])
				.tickFormat(d3.format(",.0f"))

			padding= 50;
			var xg = svg.append("g")
				.call(xAxis)
				.attr("class", "axis")
				.attr("transform", "translate(0," + (height - padding) + ")")


			
			//show life expectancy axis at the left side of the graph:
			var yAxis= d3.axisLeft()
				.scale(lifeExpectancyScale)
				.tickValues(arvalues(LifeRange[0], LifeRange[1], 5, 10))
				.tickFormat(d3.format(",.0f"))
			
			var yg= svg.append("g")
				.call(yAxis)
				.attr("class", "axis")
				.attr("transform", "translate(" + padding + ",0)")


			xg.append("text")
				.text(function(d){
					return "Income per Person (GDP per Capita)";
				})
				.attr("transform", "translate("+width/2+","+ 50 +")")
				.attr("id", "xtitle")
				
			
			yg.append("text")
				.text(function(d){
					return "Life Expectancy";
				})
				.attr("transform", "translate("+ (-50) +"," + (height/2.5)   +")rotate(270)")
				.attr("id", "ytitle")


			//for tooltip:
			var div = d3.select("body").append("div")
				.attr("class", "tooltip")
				.style("opacity", 0);
		


			//adding circles to svg:
			svg.selectAll("circle")
				.data(data)
				.enter()
				.append("circle")
				.attr("fill","pink")
				.attr("cx", function(d,index){return incomeScale(d.Income);})
				.attr("cy", function(d,index){return lifeExpectancyScale(d.LifeExpectancy);})
				.attr("r", (d) => radScale(d.Population))
				.attr("stroke", "red")
				.attr("fill", function(d){
					return colorPalette(d.Region);
				})
				.on("mouseover", function(d) {
					div.transition()
						.duration(200)
						.style("opacity", .8);
					div.html("<strong>"+d.Country+ "<br>"+ d.Region+"</strong><br>"+ "Income: $"+d3.format(",.2r")(d.Income)+"<br>Life Expectancy: "+d.LifeExpectancy+" years.")
						.style("left", (d3.event.pageX) + "px")
						.style("top", (d3.event.pageY - 28) + "px");
					})
				.on("mouseout", function(d) {
				div.transition()
					.duration(500)
					.style("opacity", 0);
				})
				.on("click", function(d){
					console.log(d.city+": "+stylenum(d.population));
					document.getElementById("teller").innerHTML="You just clicked on: "+"<strong>"+d.city+"</strong>"+", population "+stylenum(d.population)+".";
				});

	});
