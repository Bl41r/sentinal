'use strict';

// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {
  console.log(dataR);
  // Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Topping');
  data.addColumn('number', 'Slices');
  data.addRows([
    // ['Positive', 10],
    // ['Negative', 5],
    // ['Neutral', 5]
    ['Positive', parseInt(dataR[1])],
    ['Negative', parseInt(dataR[2])],
    ['Neutral', parseInt(dataR[3])]
  ]);

  // Set chart options
  var options = {
    'width':700,
    'height':500,
    'colors':['#aaf66d', '#d84949', '#6dcff6'],
    'is3D': true
  };

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}
