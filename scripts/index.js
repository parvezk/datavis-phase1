const h = 420;
const w = 840;
let dataset;
let showrates = false;

const svg = d3.select(".container svg");
svg.attrs({ width: w, height: h }).style("background", "oldlace");

const lineG = svg.append("g");
const nodeG = svg.append("g");

const addLineGraph = () => {
	lineG.style("background", "oldlace");
	const lineFun = d3
		.line()
		.x(function(d) {
			const x = d.crime_index_ranking * 80;
			return Math.trunc(x);
		})
		.y(function(d) {
			//console.log(d.rate)
			const y = h - Math.trunc(d.rate) / 25;
			return Math.trunc(y);
		})
		.curve(d3.curveLinear);

	const viz = lineG.append("path").attrs({
		class: "line-graph",
		d: lineFun(dataset),
		stroke: "cadetblue",
		"stroke-width": 2,
		opacity: 1,
		fill: "none",
		transform: "translate(0, 0)"
	});
};

const addDots = () => {
	nodeG.style("background", "lemonchiffon");
	nodeG
		.selectAll("circle")
		.data(dataset)
		.enter()
		.append("circle")
		.attrs({
			cx: d => {
				const x = d.crime_index_ranking * 80;
				return Math.trunc(x);
			},
			cy: d => {
				const y = h - Math.trunc(d.rate) / 25;
				return Math.trunc(y);
			},
			r: 5,
			opacity: 1,
			fill: d => salesKPI(d.rate),
			// 'fill': 'cornflowerblue',
			transform: "translate(0, 0)"
		});
};

const buildLine = type => {
	//svg.selectAll("*").remove();

	if (type == "line") {
		svg.selectAll("circle").remove();
		addLineGraph();
	} else if (type == "scatter") {
		svg.selectAll("path.line-graph").remove();
		// add dots
		addDots();
	} else if (type == "both") {

		addDots();
		addLineGraph();
	} else if ((type = "toggle")) {
		showrates = showrates ? false : true;
		console.log(showrates);
		svg.selectAll("g").remove();
		if (showrates) {
			addLabels();
			buildAxis();
		} else {
			svg.selectAll("text").remove();
			buildAxis();
		}
	} else {
	} // end of if
}; // end of buildLines

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
			//console.log(i, dataset[i].city)
			return dataset[i].city;
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
		.attr("transform", "translate(40, -7)")
		.call(yAxis);
};

const addLabels = () => {
	console.log("comes here");
	// add labels
	const labels = svg
		.selectAll("text")
		.data(dataset)
		.enter()
		.append("text")
		.text(d => {
			return Math.trunc(d.rate);
		})
		.attrs({
			class: "circles",
			x: d => {
				const x = d.crime_index_ranking * 80 - 15;
				return Math.trunc(x);
			},
			y: d => {
				const y = h - Math.trunc(d.rate) / 25 - 10;
				return Math.trunc(y);
			},
			"font-family": "sans-serif",
			"font-size": "12px",
			fill: "#666666",
			"text-anchor": "start"
		});
};

//const path = "https://data.cityofnewyork.us/resource/h6yn-47fn.json";
const path = "./../rows.json";
d3.json(path, function(error, data) {
	dataset = data;
	//console.log(data)
	addDots();
	addLineGraph();
	addLabels();
	buildAxis();
});

// KPI #666666; #33CC66
const salesKPI = d => {
	if (d >= 4800) {
		return "red";
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

const buttons = document.querySelectorAll("a");

buttons.forEach(button => {
	//button.addEventListener("click", showGraph, false);
	//button.addEventListener("click", (e) => { this.onClick(e); });
	button.addEventListener("click", function(e) {
		e.preventDefault();
		const type = this.className;
		buildLine(type);
	});
});

const showGraph = e => {
	e.preventDefault();
	console.log("ll");
};

/*
buttons.onclick((e) => {
	e.preventDefault();
	const button = e.attr('class');
	console.log(button);
})
*/
