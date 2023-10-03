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
            title: 'Bar Chart - Electric Range by Model',
            xaxis: { title: 'Electric Range' },
            yaxis: { title: 'Model' }
        };

        var barData = [trace];

        Plotly.newPlot('barChart', barData, layout);
});}

// Function to create the pie chart
function createPieChart() {
    // Fetch data for the pie chart from Flask route /pie
    d3.json("/pie").then((data) => {
        var labels = Object.keys(data);
        var values = Object.values(data);

        var trace = {
            values: values,
            labels: labels,
            type: 'pie'
        };

        var layout = {
            title: 'Pie Chart - Electric Range Distribution'
        };

        var pieData = [trace];

        // Create the pie chart in the 'pieChart' div
        Plotly.newPlot('pieChart', pieData, layout);
    });
}

// Call both functions to create the charts
createBarChart();
createPieChart();