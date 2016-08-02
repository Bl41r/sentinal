'use strict';

// initialize charts to null
var chart1 = null;
var chart2 = null;

// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

function loadChart() {
  console.log('in load chart');

  if (chart1 !== null) {
    chart1.clearChart();
  }

  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawChart1);

  // Callback that creates and populates a data table,
  // instantiates the pie chart, passes in the data and
  // draws it.
  function drawChart1() {
    // console.log('drawing table1 with ' + resultsData[5]);
    // Create the data table.
    var data1 = new google.visualization.DataTable();
    data1.addColumn('string', 'Topping');
    data1.addColumn('number', 'Slices');
    data1.addRows([
      ['Positive', resultsData[1]],
      ['Negative', resultsData[2]],
      ['Neutral', resultsData[3]]
    ]);
    // Set chart options
    var options1 = {
      'title': 'Twitter sentiment for ' + resultsData[5] + ' is ' + resultsData[6],
      'width':700,
      'height':500,
      'colors':['#aaf66d', '#d84949', '#6dcff6'],
      'is3D': true
    };

    // Instantiate and draw our chart, passing in some options.
    chart1 = new google.visualization.PieChart(document.getElementById('keyword1'));
    chart1.draw(data1, options1);

    // Check if localStorage contains any past results
    if ((localStorage.getItem('pastresults') !== null) &&
        (JSON.parse(localStorage.getItem('pastresults'))[5] !== resultsData[5])){
      var pastResultsData = JSON.parse(localStorage.getItem('pastresults'));

      console.log('drawing table2 with ' + pastResultsData[5]);
      console.log('in code to draw table2, this is chart2 ' + chart2);

      if (chart2 !== null) {
        chart2.clearChart();
      }
      google.charts.setOnLoadCallback(drawChart2);

      function drawChart2() {
        // Create the data table.
        var data2 = new google.visualization.DataTable();
        data2.addColumn('string', 'Topping');
        data2.addColumn('number', 'Slices');
        data2.addRows([
          ['Positive', pastResultsData[1]],
          ['Negative', pastResultsData[2]],
          ['Neutral', pastResultsData[3]]
        ]);
        // Set chart options
        var options2 = {
          'title': 'Twitter sentiment for ' + pastResultsData[5] + ' is ' + pastResultsData[6],
          'width':700,
          'height':500,
          'colors':['#aaf66d', '#d84949', '#6dcff6'],
          'is3D': true
        };

        chart2 = new google.visualization.PieChart(document.getElementById('keyword2'));
        chart2.draw(data2, options2);
        localStorage.setItem('pastresults', JSON.stringify(resultsData));
      }
    }
  }
}
