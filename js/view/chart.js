'use strict';

// initialize charts to null
var chart1 = null;
var chart2 = null;
var link;
var baseUrl = window.location.hostname;

function createLink(rData, oldData) {
  //create shareable link
  //ex: 'http://localhost:3000/share/Trump?sent1=negative&s1=3&p1=2&n1=3&neu1=5&t2=Hillary&sent2=positive&s2=5&p2=5&n2=3&neu2=5'
  if (baseUrl = 'localhost') {baseUrl = 'localhost:3000';}
  var shareString = 'http://' + baseUrl + '/share/' + rData[5] + '?' + 'sent1=' + rData[6] + '&s1=' + rData[0] + '&p1=' + rData[1] + '&n1=' + rData[2] + '&neu1=' + rData[3] + '&d1=' + rData[7] + '&t2=' + oldData[5] + '&sent2=' + oldData[6] + '&s2=' + oldData[0] + '&p2=' + oldData[1] + '&n2=' + oldData[2] + '&neu2=' + oldData[3] + '&d2=' + oldData[7];
  console.log(shareString);
  return shareString;
}

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
      'width':500,
      'height':400,
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
          'width':500,
          'height':400,
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
    } else {link = createLink(resultsData, [0,0,0,0,0,'','']);}
  }
}
