module.exports = require('./lib/Twitter');
var bodies = [];

var express = require('express'),
  requireProxy = require('express-request-proxy'),
  port = process.env.PORT || 3000,
  app = express();

module.exports = require('./lib/Twitter');

//Callback functions
var error = function (err, response, body) {
  console.log('ERROR [%s]', err);
};
var success = function (data) {
  console.log(data);
  return data;
};

var Twitter = module.exports.Twitter;

  //Get this data from your twitter apps dashboard
var config = {
  'consumerKey': process.env.TWITTER_CONSUMER_KEY,
  'consumerSecret': process.env.TWITTER_CONSUMER_SECRET,
  'accessToken': process.env.TWITTER_APP_ACCESS_TOKEN,
  'accessTokenSecret': process.env.TWITTER_APP_ACCESS_TOKEN_SECRET,
  'callBackUrl': ''  //our web app url will go here
};

var twitterInstance = new Twitter(config);

// var proxyTwitter = function(request, response) {
//   console.log('Routing Twitter request for ', request.params[0]);
//   (
//     requireProxy({
//       url: 'https://api.twitter.com/' + request.params[0],
//       headers: { Authorization: 'token ' + process.env.TWITTER }
//     })
//   )(request, response);
// };

var fs = require('fs');
var dictionary = JSON.parse(fs.readFileSync('js/model/sentiment_dictionary.json'));

function cleanup(tweet) { //called by analyzeTweet, expects a string
  console.log('raw tweet: ', tweet);

  tweet = tweet
  .replace(/[.,\/#$!%\^\*;:&{}=\-_()`~><@+|]/g, '')
  .replace(/'/g, ' ') //replace ' with a space
  .split(' ').filter(function(t) { //return array of words of length >2
    return t.length > 2;
  });
  // console.log('cleaned tweet: ', tweet);
  return tweet;
}

function analyzeTweet(tweet) {  //assigns +1, 0,or -1 to a tweet
  var score = 0;
  tweet = cleanup(tweet);
  tweet.forEach(function(w) {
    if (w in dictionary) {
      console.log(w, dictionary[w]);
      score += dictionary[w];
    }
  });
  console.log('raw score: ', score);
  if (!score) {
    console.log('score assigned --> 0');
    return score;
  } else {
    console.log('score assigned --> ' + (score / Math.abs(score)));
    return (score / Math.abs(score));
  }
}

function processTweets(tweets) {
  var finalScore = 0;

  tweets.forEach(function(tweet) {
    finalScore += analyzeTweet(tweet);
  });
  console.log('Final Score: ' + finalScore + ' out of ' + tweets.length + ' tweets.');
  return [finalScore, tweets.length];
}

app.set('views', '.');
app.set('view engine', 'ejs');

app.get('/test', function(request, response) {
  bodies = [];  //tweet bodies
  var twitterData = twitterInstance.getSearch({ count: '50', q:'#Beer'}, error, function(data){
    data = JSON.parse(data);
    data = data.statuses;
    // console.log(data);
    data.forEach(function(d) {
      if (d.lang === 'en') {
        bodies.push(d.text);
      }
    });
    console.log(bodies);
    var final = processTweets(bodies);
    response.render('index', {data: final});
  });
});

// app.get('/twitter/*', proxyTwitter);

app.use(express.static('./'));

app.get('/', function(request, response) {
  console.log('New request:', request.url);
  response.sendFile('index.ejs', { root: '.' });
});

app.listen(port, function() {
  console.log('Server started on port ' + port + '!');
});
