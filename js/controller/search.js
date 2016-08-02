// get form input, attach to the event listener
// event listener will call the function for ajax get
// form the url string which gets passed to the ajax get call
var submitBtn = $('.btn-default');
var formInput = $('.search-form');
var url;
var resultsData;

function updatePage() {
  //make chart, fadeIn results, etc.
  console.log('This would have been way easier than templates..');
  $('#search-term').text(resultsData[5]);
  $('#sentiment').text(resultsData[6]);
  loadChart();
}

formInput.submit(function(event){
  event.preventDefault();
  var searchTerm = event.target.term.value;
  console.log(event);
  console.log('event target stuff: ', event.target.term.value);
  console.log('search term:' + searchTerm);
  url = '/search/' + searchTerm;
  // window.location.href = url;
  $.get(url)
  .success(function(data){
    console.log('yay!');
    console.log(data);
    resultsData = data;
    if (localStorage.getItem('pastresults') === null){
      localStorage.setItem('pastresults', JSON.stringify(data));
    }
  })
  .done(updatePage);
});
