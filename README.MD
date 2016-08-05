# **Sentinal**, for Twitter Sentiment Analysis
Sentinal is a web-based single page application built by a group of students at [Code Fellows, Seattle](http://www.codefellows.org/).

Sentinal is built using JQuery, Javascript, Bootstrap, HTML, CSS, AJAX, JSON and Twitter's REST APIs, Node.js and is based on MVC architecture. Keyword search data is stored in browser local storage.

## Launch point on Heroku
 https://project-sentinal.herokuapp.com/

## User Stories
* Type a single keyword or multiword keyword separated by spaces into the text box on the home page to initiate a search. This application will provide two side by side charts for comparison.
* Examples of single word keyword searches are Mariners, mariners, #mariners, @mariner.
* Examples of multiple keyword searches are #2016#election#year, chocolate chip cookies.
* A search result may be shared on Facebook, Twitter, or as a link using the appropriate social link button at the bottom of the search results page.

## Known issues
* Due to discrepancies in Javascript support on Safari, not all screen sizes and resolutions are mobile-responsive.

## Appreciation
- https://github.com/BoyCook/TwitterJSClient for code connecting to the twitter API
- http://bootsnipp.com/snippets/featured/spinning-social-icons

## Developer Notes
To use this code or to extend it, you should first register for developer API keys on twitter.com. You should then define and export the following twitter keys in your .bashrc or .bash_profile file, and source that file.  
TWITTER_CONSUMER_KEY=""
TWITTER_CONSUMER_SECRET=""
TWITTER_APP_ACCESS_TOKEN=""
TWITTER_APP_ACCESS_TOKEN_SECRET=""

This web application uses Twitter's [Oauth authentication] (https://dev.twitter.com/oauth/3-legged) to authenticate the user to Twitter. You may use [Application-Only Authentication](https://dev.twitter.com/oauth/application-only) depending on your requirement. Node is the local server environment used, and you need to set up your node server before any testing on your local machine. Refer to the documentation on Node.js to see how to do that.
