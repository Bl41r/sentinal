'use strict';
// get form input, attach to the event listener
// event listener will call the function for ajax get
// form the url string which gets passed to the ajax get call
var submitBtn = $('.btn-default');
var formInput = $('.search-form');
var url;
var resultsData;

function updatePage() {
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
  $('#result-section').fadeIn();
  var searchTerm = event.target.term.value;
  document.getElementById('searchfield').value = '';
  url = '/search/' + searchTerm;
  $('#spin-wheel').css('visibility','visible');
  $.get(url)
  .success(function(data){
    $('#spin-wheel').css('visibility','hidden');
    $('#social-section').fadeIn();
    resultsData = data;
    if (localStorage.getItem('pastresults') === null && resultsData[4] !== 0){
      localStorage.setItem('pastresults', JSON.stringify(data));
    }
  })
  .done(updatePage);
});
