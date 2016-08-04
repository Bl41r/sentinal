'use strict';
page('/', homeController);
page('/faq', faqController);
page('/about' , aboutController);
page('/share*' , shareController);
page('/*', homeController);
page();
