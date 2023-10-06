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
            yaxis: { title: 'Model' },
            height: 800,
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

        Plotly.newPlot('pieChart', pieData, layout);
    });
}


// Function to create the line chart
function createLineChart(selectedModel) {
    d3.json("/line").then((data) => {
        var ctx = document.getElementById("lineChart").getContext("2d");

        // Extract the data for the selected model
        var selectedModelData = data[selectedModel];
        var labels = Object.keys(selectedModelData);
        var electricRanges = Object.values(selectedModelData);

        if (lineChart) {
            // If the line chart already exists, update
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
                            label: "Tesla's Range",
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
        // Update the chart title
        lineChart.options.title.text = "Line Chart - Electric Range by " + selectedModel;
        // Update the chart
        lineChart.update();
                                    });
}

// Initial chart creation
var lineChart;
// Default chart to "Model 3"
createLineChart("MODEL 3");

// Event listener for dropdown
document.getElementById("modelSelector").addEventListener("change", function() {
    // Get model from the dropdown menu
    var selectedModel = document.getElementById("modelSelector").value;

    // Create/update the line chart with the model
    createLineChart(selectedModel);

});

// Call functions to create the charts
createBarChart();
createPieChart();
createLineChart();
