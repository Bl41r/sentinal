// get form input, attach to the event listener
// event listener will call the function for ajax get
// form the url string which gets passed to the ajax get call
var submitBtn = $('.btn-default');
var formInput = $('.search-form');
var url;
var resultsData;
var link;

function createLink(rData) {
  //create shareable link

  var baseUrl = 'http://' + window.location.hostname;
  shareString = baseURL + '/share/' + r[5] + '?' + 'sent1=' + rData[6] + '&s1=' + rData[0] + '&p1=' + rData[1] + '&n1=' + rData[2] + '&neu1=' + rData[3] + '&t2=' + 'Hillary' + '&sent2=' + 'positive' + '&s2=' + '0' + '&p2=' + '0' + '&n2=' + '0' + '&neu2=' + '0';

  console.log(shareString);
  return shareString;
}

function updatePage() {
  link = createLink(resultsData);

  //make chart, fadeIn results, etc.
  $('#search-term').text(resultsData[5]);
  $('#sentiment').text(resultsData[6]);
  $('#result-section').fadeIn();

  if (resultsData[4] === 0) {
    $('#no_results').fadeIn();
    $('#no_results').text('There are no results for ' + resultsData[5]);
    return;
  } else {
    $('#no_results').fadeOut();
  }
  loadChart();
}

formInput.submit(function(event){
  event.preventDefault();
  var searchTerm = event.target.term.value;
  console.log(event);
  console.log('event target stuff: ', event.target.term.value);
  console.log('search term:' + searchTerm);
  url = '/search/' + searchTerm;
  $('#spin-wheel').css('visibility','visible');
  $.get(url)
  .success(function(data){
    console.log(data);
    $('#spin-wheel').css('visibility','hidden');
    resultsData = data;
    if (localStorage.getItem('pastresults') === null && resultsData[4] !== 0){
      localStorage.setItem('pastresults', JSON.stringify(data));
    }
  })
  .done(updatePage);
});
