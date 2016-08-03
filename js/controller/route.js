'use strict';

page('/', homeController);
page('/faq', faqController);
page('/about' , aboutController);

// page('/share/:' , resultsFromURL(window.location.href));

page('/share*' , shareController);




page();
