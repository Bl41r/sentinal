'use strict';
// initialize charts to null
var chart1 = null;
var chart2 = null;
var link;

// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

function loadChart() {

  if (chart1 !== null) {
    chart1.clearChart();
  }

  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawChart1);

  // Callback that creates and populates a data table,
  // instantiates the pie chart, passes in the data and
  // draws it.
  function drawChart1() {
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
      'title': 'Twitter sentiment for "' + resultsData[5] + '" is ' + resultsData[6],
      'width':375,
      'height':375,
      'colors':['#aaf66d', '#d84949', '#6dcff6'],
      'titleTextStyle':{
        color: '#333',
        fontName: 'Open Sans, Avenir Next, Helvetica Neue',
        fontSize: 24,
        bold: false,
        italic: false
      },
      'chartArea': {
        'width': '100%',
        'height': '65%'},
    };

    // Instantiate and draw our chart, passing in some options.
    chart1 = new google.visualization.PieChart(document.getElementById('keyword1'));
    chart1.draw(data1, options1);

    // Check if localStorage contains any past results
    if ((localStorage.getItem('pastresults') !== null) &&
        (JSON.parse(localStorage.getItem('pastresults'))[5] !== resultsData[5])){
      var pastResultsData = JSON.parse(localStorage.getItem('pastresults'));
      link = createLink(resultsData, pastResultsData);

      // if (chart2 !== null) {
      //   chart2.clearChart();
      // }
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
          'title': 'Twitter sentiment for "' + pastResultsData[5] + '" is ' + pastResultsData[6],
          'width':375,
          'height':375,
          'colors':['#aaf66d', '#d84949', '#6dcff6'],
          'titleTextStyle':{
            color: '#333',
            fontName: 'Open Sans, Avenir Next, Helvetica Neue',
            fontSize: 24,
            bold: false,
            italic: false
          },
          'chartArea': {
            'width': '100%',
            'height': '65%'},
        };

        chart2 = new google.visualization.PieChart(document.getElementById('keyword2'));
        chart2.draw(data2, options2);
        localStorage.setItem('pastresults', JSON.stringify(resultsData));
      }
    } else {
      // remove any charts that remain from shared links
      if (chart2 !== null) {
        chart2.clearChart();
      }
      link = createLink(resultsData, [0,0,0,0,0,'','']);}
  }
}

// helper function to parse date from the server shared link
// so it can be used in the title of the shared charts
function parseDate(dateString) {
  var d1 = dateString.split('T');
  var d2 = d1[1].split(':');
  var time = d2[0] + ':' + d2[1] + ' GMT,';
  return (d1[0] + ', ' + time + '\n');
}

function loadChartShare(){
  var shareURL = window.location.href;
  var parameters = shareURL.split('share/');
  parameters = parameters[1].split('?');
  google.charts.setOnLoadCallback(drawChartShare);
  $('.icoTwitter').attr('href', 'https://twitter.com/home?status=Here%20is%20the%20twitter%20sentiment%20for "' + parameters[5] + '" ' + shareURL);

  function drawChartShare() {
    // Create the data table.
    var data1 = new google.visualization.DataTable();
    data1.addColumn('string', 'Topping');
    data1.addColumn('number', 'Slices');
    data1.addRows([
      ['Positive', parseInt(parameters[1])],
      ['Negative', parseInt(parameters[2])],
      ['Neutral', parseInt(parameters[3])]
    ]);
    // Set chart options
    var options1 = {
      'title': 'On ' + parseDate(parameters[7]) + ' Twitter sentiment for "' + parameters[5].replace('%20', ' ') + '" was ' + parameters[6],
      'width':375,
      'height':375,
      'colors':['#aaf66d', '#d84949', '#6dcff6'],
      'titleTextStyle':{
        color: '#333',
        fontName: 'Open Sans, Avenir Next, Helvetica Neue',
        fontSize: 18,
        bold: false,
        italic: false
      },
      'chartArea': {
        'width': '100%',
        'height': '65%'},
    };

    // Instantiate and draw our chart, passing in some options.
    chart1 = new google.visualization.PieChart(document.getElementById('keyword1'));
    chart1.draw(data1, options1);

    if (parameters[13] !== '') {
      var data2 = new google.visualization.DataTable();
      data2.addColumn('string', 'Topping');
      data2.addColumn('number', 'Slices');
      data2.addRows([
        ['Positive', parseInt(parameters[9])],
        ['Negative', parseInt(parameters[10])],
        ['Neutral', parseInt(parameters[11])]
      ]);
      // Set chart options
      var options2 = {
        'title': 'On ' + parseDate(parameters[15]) + ' Twitter sentiment for "' + parameters[13].replace('%20', ' ') + '" is ' + parameters[14],
        'width':375,
        'height':375,
        'colors':['#aaf66d', '#d84949', '#6dcff6'],
        'titleTextStyle':{
          color: '#333',
          fontName: 'Open Sans, Avenir Next, Helvetica Neue',
          fontSize: 18,
          bold: false,
          italic: false
        },
        'chartArea': {
          'width': '100%',
          'height': '65%'},
      };
      chart2 = new google.visualization.PieChart(document.getElementById('keyword2'));
      chart2.draw(data2, options2);
    }
  }
}
