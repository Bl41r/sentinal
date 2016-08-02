'use strict';
function homeController() {
  $('.section').hide();
  $('#home-section').fadeIn();
  $('#result-section').hide();
  $('.nav-item').css('border-bottom', 'none');
  $('#home-nav').css('border-bottom', '2px solid #6dcff6');

};