// get form input, attach to the event listener
// event listener will call the function for ajax get
// form the url string which gets passed to the ajax get call
var submitBtn = $('.btn-default');
var formInput = $('.search-form');
var url;
var resultsData;

function updatePage() {
  //create shareable link
  var baseUrl = 'http://' + window.location.hostname;
  shareString = '/share/' + resultsData[5] + '?' + 'sent1=' + resultsData[6] + '&s1=' + resultsData[0] + '&p1=' + resultsData[1] + '&n1=' + resultsData[2] + '&neu1=' + resultsData[3] + '&t2=' + 'Hillary' + '&sent2=' + 'positive' + '&s2=' + '0' + '&p2=' + '0' + '&n2=' + '0' + '&neu2=' + '0';
  console.log(baseUrl + shareString);

  //make chart, fadeIn results, etc.
  console.log('This would have been way easier than templates..');
  $('#search-term').text(resultsData[5]);
  $('#sentiment').text(resultsData[6]);
  $('#result-section').fadeIn();

  if (resultsData[4] === 0) {
    $('#result-text').text('There are no results for ' + resultsData[5]);
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
    console.log('yay!');
    console.log(data);
    document.getElementById('spin-wheel').style.display = 'none';
    resultsData = data;
    if (localStorage.getItem('pastresults') === null){
      localStorage.setItem('pastresults', JSON.stringify(data));
    }
  })
  .done(updatePage);
});
