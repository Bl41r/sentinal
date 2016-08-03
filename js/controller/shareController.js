'use strict';
function shareController() {
  $('#faq').hide();
  $('#about').hide();
  $('.nav-item').css('border-bottom', 'none');
  $('#home-nav').css('border-bottom', '2px solid #6dcff6');

  loadChartShare();

};