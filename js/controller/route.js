'use strict';

window.onload = function() {
	homeController();
};

page();
page('/', home);
page('/faq', faq);
page('/about' , about);


function home() {
	homeController();
}

function about() {
  aboutController();
}

function faq() {
  faqController();
}