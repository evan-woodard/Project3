// Function to create the bar chart
function createBarChart() {
    d3.json("/bar").then((data) => {
        var modelNames = data.map(function(item) { return item.Model; });
        var electricRanges = data.map(function(item) { return item.ElectricRange; });

        var trace = {
            x: electricRanges,
            y: modelNames,
            type: 'bar',
            orientation: 'h'
        };

        var layout = {
            title: 'Electric Range by Model',
            xaxis: { title: 'Electric Range' },
            yaxis: { title: 'Model' }
        };

        var barData = [trace];

        Plotly.newPlot('barChart', barData, layout);
    });
}

// Function to create the pie chart
function createPieChart() {
    d3.json("/pie").then((data) => {
        var labels = Object.keys(data);
        var values = Object.values(data);

        var trace = {
            values: values,
            labels: labels,
            type: 'pie'
        };

        var layout = {
            title: 'Electric Range Distribution'
        };

        var pieData = [trace];

        // Create the pie chart in the 'pieChart' div
        Plotly.newPlot('pieChart', pieData, layout);
    });
}


// Define your data as an object with car models and their electric range data
var data = {
    "MODEL 3": {
        "2017": 220,
        "2018": 215,
        "2019": 220,
        "2020": 295
    },
    "MODEL S": {
        "2012": 265,
        "2013": 208,
        "2014": 208,
        "2015": 208,
        "2016": 210,
        "2017": 210,
        "2018": 249,
        "2019": 270,
        "2020": 331
    },
    "MODEL X": {
        "2016": 200,
        "2017": 200,
        "2018": 238,
        "2019": 289,
        "2020": 291
    },
    "MODEL Y": {
        "2020": 291
    }
};

// Function to create the line chart
function createLineChart(selectedModel) {
    var ctx = document.getElementById("lineChart").getContext("2d");

    // Extract the data for the selected model
    var selectedModelData = data[selectedModel];
    var labels = Object.keys(selectedModelData);
    var electricRanges = Object.values(selectedModelData);

    if (lineChart) {
        // If the line chart already exists, update its data
        lineChart.data.labels = labels;
        lineChart.data.datasets[0].data = electricRanges;
        lineChart.options.title.text = "Line Chart - Electric Range by " + selectedModel;
        lineChart.update(); // Update the chart
    } else {
        // If the line chart doesn't exist, create it
        lineChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: selectedModel,
                        data: electricRanges,
                        borderColor: "red", // You can set the color as desired
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: "Line Chart - Electric Range by " + selectedModel
                }
            }
        });
    }
}

// Event listener for changes in the dropdown menu
document.getElementById("modelSelector").addEventListener("change", function() {
    // Get the selected car model from the dropdown menu
    var selectedModel = document.getElementById("modelSelector").value;

    // Create or update the line chart with the selected model
    createLineChart(selectedModel);
});

// Initial chart creation (default to "MODEL 3")
var lineChart;
createLineChart("MODEL 3");

// Call all three functions to create the charts
createBarChart();
createPieChart();
createLineChart();