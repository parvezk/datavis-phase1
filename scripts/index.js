// Load data & callbacks
const source = "rows.json";
d3.json(source, (error, data) => {

	dataset = MergeData(data);
	//console.log(dataset);
	addDots();
	addLineGraph();
	addLabels();
	buildAxis();
});

const statesdata = "states.json";
let mergeddata,
	state,
	key = [];

const MergeData = data => {
	
	d3.json(statesdata, (error, states) => {
		//console.log(data.data)
		data.data.map((obj, i) => {

			obj["rate"] = obj.forEach((j, k) => { return obj[11] } )
			obj["state"] = states[i].state;
			obj["population"] = states[i].population;
		});

	});
	return data;
};

const buttons = document.querySelectorAll("a");
buttons.forEach(button => {
	//button.addEventListener("click", showGraph, false);
	//button.addEventListener("click", (e) => { this.onClick(e); });
	button.addEventListener("click", function(e) {
		e.preventDefault();
		const type = this.className;
		switchViews(type);
	});
});

// Chart
const h = 420;
const w = 840;
const haxis = 80;
const vaxis = 25;
let dataset;
let showrates = true;

const switchViews = type => {
	//svg.selectAll("*").remove();
	if (type == "line") {
		svg.selectAll("circle").remove();
		addLineGraph();
		addLabels();
	} else if (type == "nodes") {
		// svg.selectAll("path.line-graph").remove();
		// add dots
		addDots();
		addLabels();
	} else if (type == "both") {
		addDots();
		addLineGraph();
		addLabels();
	} else if ((type = "rates")) {

		showrates = showrates ? false : true;
		
		if (showrates) {
			
			console.log("ON")
			addLabels();
			showrates = true;
			
		} else {
			console.log("OFF")
			svg.selectAll(".labels").remove();
			showrates = false;
		}

	} // end of if
}; // end of buildLines

const svg = d3.select(".container svg");
svg.attrs({ width: w, height: h }).style("background", "oldlace");

var div = d3
	.select("body")
	.append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

const lineG = svg.append("g").attr("class", "lineG")
const nodeG = svg.append("g").attr("class", "nodeG")

const addLineGraph = () => {
	lineG.style("background", "oldlace");
	const lineFun = d3
		.line()
		.x(function(d) {
			const x = d[2] * haxis;
			return Math.trunc(x);
		})
		.y(function(d) {
			//console.log(d.rate)
			const y = h - Math.trunc(d[11]) / vaxis;
			return Math.trunc(y);
		})
		.curve(d3.curveLinear);

	const viz = lineG.append("path").attrs({
		class: "line-graph",
		d: lineFun(dataset.data),
		stroke: "cadetblue",
		"stroke-width": 2,
		opacity: 1,
		fill: "none",
		transform: "translate(0, 0)"
	});
};

const addDots = () => {
	let i = 1;
	nodeG.style("background", "lemonchiffon");
	nodeG
		.selectAll("circle")
		.data(dataset.data)
		.enter()
		.append("circle")
		.attrs({
			cx: d => {
				const x = d[2] * haxis;
				return Math.trunc(x);
			},
			cy: d => {
				console.log(d)
				const y = h - Math.trunc(d[11]) / vaxis;
				return Math.trunc(y);
			},
			r: 5,
			opacity: 1,
			fill: d => salesKPI(d[11]),
			// 'fill': 'cornflowerblue',
			transform: "translate(0, 0)"
		})
		.style("cursor", "pointer")
		.on("mouseover", function(d) {
			console.log(d);
			div
				.transition()
				.duration(200)
				.style("opacity", 0.9);
			div
				.html(
					"<article>" +
						"<p>" +
						"Crime Index Rating: <span>" +
						d.crime_index_ranking +
						"</span></p>" +
						//"<p>" + "State: " + d.state + "</p>" +
						"<p>" +
						"Population: <span>" +
						d.population +
						"</span></p>" +
						"</article>"
				)
				.style("left", d3.event.pageX + 5 + "px")
				.style("top", d3.event.pageY - 28 + "px");
		})
		.on("mouseout", function(d) {
			div
				.transition()
				.duration(500)
				.style("opacity", 0);
		});
	i++;
};

const addLabels = () => {
	// add labels
	const labels = nodeG
		.selectAll("text")
		.data(dataset)
		.enter()
		.append("text")
		.text(d => {
			console.log(d)
			return Math.trunc(d[11]);
		})
		.attrs({
			class: "labels",
			x: d => {
				const x = d[2] * haxis - 15;
				return Math.trunc(x);
			},
			y: d => {
				const y = h - Math.trunc(d[11]) / vaxis - 10;
				return Math.trunc(y);
			},
			"font-family": "sans-serif",
			"font-size": "12px",
			fill: "#666666",
			"text-anchor": "start"
		});
};

const buildAxis = () => {
	// defining scales with their domain and range
	var xScale = d3
		.scaleLinear()
		.domain([0, 10])
		.range([0, w - 40])
		.nice();
	var yScale = d3
		.scaleLinear()
		.domain([0, 11000])
		.range([h, 0])
		.nice();

	var ticks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	
	var xAxis = d3
		.axisBottom()
		.scale(xScale)
		.tickValues(ticks)
		.tickFormat(function(d, i) {
			//console.log(i, Math.ceil(parseFloat(dataset.data[i][11])))
			return Math.ceil(parseFloat(dataset.data[i][11]));
		});

	var yAxis = d3
		.axisLeft()
		.scale(yScale)
		.ticks(5);

	svg
		.append("g")
		.attr("class", "axisX")
		.attr("transform", "translate(0, 380)")
		.call(xAxis);

	svg
		.append("g")
		.attr("class", "axisY")
		.attr("transform", "translate(45, -7)")
		.call(yAxis);
};

// KPI #666666; #33CC66
const salesKPI = d => {
	if (d >= 4800) {
		//return "#D17878";
		//return "#FF8080";
		//return "#FF9585";
		return "cornflowerblue";
		
	} else if (d <= 4800) {
		return "cornflowerblue";
	}
};

// Quant attributes: show/hide lables based on KPI
const showMinMax = (ds, col, val, type) => {
	const max = d3.max(ds, d => d[col]);
	const min = d3.min(ds, d => d[col]);

	if (type == "minmax" && (val == max || val == min)) {
		return val;
	} else {
		if (type == "all") {
			return val;
		}
	}
};
