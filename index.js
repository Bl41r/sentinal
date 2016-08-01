module.exports = require('./lib/Twitter');

var fs = require('fs');
var express = require('express'),
  requireProxy = require('express-request-proxy'),
  port = process.env.PORT || 3000,
  app = express();

module.exports = require('./lib/Twitter');

var repetitions = 1;
var ids = [];
var bodies = [];
var positives = 0;
var negatives = 0;

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

var dictionary = JSON.parse(fs.readFileSync('js/model/sentiment_dictionary.json'));

function cleanup(tweet) { //called by analyzeTweet, expects a string
  // console.log('raw tweet: ', tweet);
  tweet = tweet
  .replace(/[.,\/$!%\^\*;:&{}=\-_()`~><+|]/g, '')
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
      // console.log(w, dictionary[w]);
      score += dictionary[w];
    }
  });
  // console.log('raw score: ', score);
  if (!score) {
    // console.log('score assigned --> 0');
    return score;
  } else {
    // console.log('score assigned --> ' + (score / Math.abs(score)));
    if (score > 0) {positives += 1;} else {negatives += 1;}
    return (score / Math.abs(score));
  }
}

function processTweets(tweets) {
  var finalScore = 0;

  tweets.forEach(function(tweet) {
    finalScore += analyzeTweet(tweet);
  });
  console.log('Final Score: ' + finalScore + ' out of ' + tweets.length + ' tweets.');
  return [finalScore, positives, negatives, tweets.length - positives - negatives, tweets.length];
}

app.set('views', '.');
app.set('view engine', 'ejs');

function nextSearch(id, keyword, response) {
  var yo = twitterInstance.getSearch({ count: '100', q:keyword, lang: 'en', max_id: id}, error, function(data){
    data = JSON.parse(data);
    data = data.statuses;
    data.forEach(function(d) {
      bodies.push(d.text);
      ids.push(d.id);
      console.log(d.text, d.id);
    });
    ids = ids.sort();
    var lastID = ids[0] - 100;
    repetitions += 1;
    if (repetitions < 10) {
      setTimeout(function(){nextSearch(lastID, keyword, response);},200);
    } else {
      var final = processTweets(bodies);
      response.render('index', {data: final});
    }
  });
}

app.get('/test', function(request, response) {
  positives = 0;
  negatives = 0;
  bodies = [];  //tweet bodies
  ids = [];
  var keyword = 'Politics';

  var twitterData = twitterInstance.getSearch({ count: '100', q:keyword, lang: 'en', result_type: 'recent'}, error, function(data){
    data = JSON.parse(data);
    data = data.statuses;
    // console.log(data);
    data.forEach(function(d) {
      bodies.push(d.text);
      ids.push(d.id);
      console.log(d.text, d.id);
    });
    ids = ids.sort();
    var lastID = ids[0] - 100;
    setTimeout(function() {nextSearch(lastID, keyword, response);}, 200);
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
