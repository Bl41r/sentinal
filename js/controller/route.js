'use strict';

window.onload = function() {
	homeController();
};

page('/', home);
page('/faq', faq);
page('/about' , about);
page('*' , home);

page();

function home() {
	homeController();
}

function about() {
  aboutController();
}

function faq() {
  faqController();
}
