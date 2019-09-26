
// SVG Size
var width = 700,
	height = 500;


// Load CSV file

d3.csv("data/wealth-health-2014.csv", (row)=>{
	// type conversion
})
.then(data=>{
		// Analyze the dataset in the web console
		console.log(data);
		console.log("Countries: " + data.length)
});