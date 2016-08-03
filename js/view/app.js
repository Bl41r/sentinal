'use strict';
document.getElementById('modal-link').value = window.location.href;
$('.icoFacebook').attr("href", 'http://www.facebook.com/sharer.php?u=' + window.location.href);

function createLink(rData, oldData) {
  if (baseUrl === 'localhost') {baseUrl = 'localhost:3000';}
  var shareString = baseUrl + '/share/' + rData[0] + '?' + rData[1] + '?' + rData[2] + '?' + rData[3] + '?' + rData[4] + '?' + rData[5] + '?' + rData[6] + '?' + rData[7]
  + '?' + oldData[0] + '?' + oldData[1] + '?' + oldData[2] + '?' + oldData[3] + '?' + oldData[4] + '?' + oldData[5] + '?' + oldData[6] + '?' + oldData[7];
  $('.icoFacebook').attr("href", 'http://www.facebook.com/sharer.php?u=' + shareString);
  $('.icoTwitter').attr("href", 'https://twitter.com/home?status=Here%20is%20the%20twitter%20sentiment%20for "' + rData[5] + '" ' + shareString);
  
  $('#clipboard-modal').on("click", function(){
    document.getElementById('modal-link').value = link;
  });

  return shareString;
}