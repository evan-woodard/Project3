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

// Function to create the line chart
//function createLineChart(selectedModel) {
//    d3.json("/line").then((data) => {
//        // Filter data by selected model
//        var filteredData = data.filter(function(item) {
//            return item.Model === selectedModel;
//        });
//
//        var years = filteredData.map(function(item) { return item.ModelYear; });
//        var electricRanges = filteredData.map(function(item) { return item.ElectricRange; });
//
//        var trace = {
//            x: years,
//            y: electricRanges,
//            type: 'line'
//        };
//
//        var layout = {
//            title: 'Line Chart - Electric Range Over Time',
//            xaxis: { title: 'Year' },
//            yaxis: { title: 'Electric Range' }
//        };
//
//        var lineData = [trace];
//
//        Plotly.newPlot('lineChart', lineData, layout);
//    });
//}
//
//// Attach an event listener to the dropdown menu to trigger the chart update
//document.getElementById('modelDropdown').addEventListener('change', function() {
//    var selectedModel = document.getElementById('modelDropdown').value; // Get the selected 'Model' value from the dropdown
//    createLineChart(selectedModel);
//});
const fs = require('fs');
const plotly = require('plotly')('PLOTLY USERNAME', 'API KEY ');  // API KEY??? UDER_NAME??
const plotlyExpress = require('plotly-express');
// Read the processed data from the JSON file
const rawData = fs.readFileSync('PATH TO JSON FILE', 'utf8');
const data = JSON.parse(rawData);
const county = data.map(row => row['County']);
const values = [];
const figure = {
  data: [{
    type: 'choropleth',
    locations: county,
    z: values,
    locationmode: 'county names',
    colorscale: 'Viridis',
    autocolorscale: false,
    colorbar: {
      title: 'Electric Car Density',
      tickvals: [0, 5, 10],  // Adjust these values based on your data
      ticktext: ['Low', 'Medium', 'High'],  // Adjust these labels based on your data
    },
  }],
  layout: {
    title: 'Electric Car Density by County',
    geo: {
      projection: {
        type: 'natural earth',
      },
    },
  },
};
const plotlyOptions = {filename: 'choropleth-map', fileopt: 'overwrite'};
plotly.plot(figure, plotlyOptions, (err, msg) => {
  if (err) return console.log(err);
  console.log(msg);
});

// Call both functions to create the charts
createBarChart();
createPieChart();
//createLineChart();