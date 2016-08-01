// get form input, attach to the event listener
// event listener will call the function for ajax get
// form the url string which gets passed to the ajax get call
var submitBtn = $('.btn-default');
var formInput = $('.form-control');
var url;
console.log('loading search.js');

// submitBtn.click(function(event){
formInput.submit(function(event){
  console.log('in form event listener');
  event.preventDefault();
  var searchTerm = formInput.text;
  url = '/search/' + searchTerm;
  $.get(url)
      .done(function(data) {
        console.log('CALLBACK from client side ajax get call');
      });
});
