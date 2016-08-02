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
  var searchTerm = event.target.term.value;
  console.log(event);
  console.log('event target stuff: ', event.target.term.value);
  console.log('search term:' + searchTerm);
  url = '/search/' + searchTerm;
  document.getElementById('spin-wheel').style.display = 'block';
  // window.location.href = url;
  $.get(url)
  .success(function(data){
    console.log(data);
    document.getElementById('spin-wheel').style.display = 'none';
    resultsData = data;
    if (localStorage.getItem('pastresults') === null && resultsData[4] !== 0){
      localStorage.setItem('pastresults', JSON.stringify(data));
    }
  })
  .done(updatePage);
});
