'use strict';
function shareController() {
  $('#home-section').fadeIn();
  $('#result-section').fadeIn();
  $('#faq-section').hide();
  $('#about-section').hide();
  $('.nav-item').css('border-bottom', 'none');
  $('#home-nav').css('border-bottom', '2px solid #6dcff6');
  loadChartShare();
};