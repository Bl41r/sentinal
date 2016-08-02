'use strict';

function test() {console.log('test called');}

page('/', homeController);
page('/faq', faqController);
page('/about' , aboutController);
page();
