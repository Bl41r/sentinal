'use strict';
// get form input, attach to the event listener
// event listener will call the function for ajax get
// from the url string which gets passed to the ajax get call
var submitBtn = $('.btn-default');
var formInput = $('.search-form');
var url;
var resultsData;

function updatePage() {
  //make chart, fadeIn results, etc.
  $('#search-term').text(resultsData[5]);
  $('#sentiment').text(resultsData[6]);
  if (resultsData[4] === 0) {
    $('#no_results').fadeIn();
    $('#no_results').text('There are no results for ' + resultsData[5]);
    document.getElementById('result-section').style.display = 'block';
    return;
  } else {
    $('#no_results').fadeOut();
    $('#social-section').fadeIn();
  }
  loadChart();
  console.log('here');
  $('#result-section')[0].style.display = 'block';
  $('#result-section').fadeIn(2000);
}

formInput.submit(function(event){
  event.preventDefault();
  var searchTerm = event.target.term.value;
  searchTerm = encodeURIComponent(searchTerm);
  document.getElementById('searchfield').value = '';
  $('input#searchfield')[0].blur();
  $('#search').css('opacity', '0');
  url = '/search/' + searchTerm;
  $('#spin-wheel').css('visibility','visible');
  $.get(url)
  .success(function(data){
    $('#spin-wheel').css('visibility','hidden');

    resultsData = data;
    if (localStorage.getItem('pastresults') === null && resultsData[4] !== 0){
      localStorage.setItem('pastresults', JSON.stringify(data));
    }
  })
  .fail(function() {
    alert('Attempt failed!');
    $('#spin-wheel').css('visibility','hidden');
    $('#search').css('opacity', '1');
  })
  .done(function() {
    updatePage();
    $('#search').css('opacity', '1');
  });
});
