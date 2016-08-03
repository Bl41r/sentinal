module.exports = require('./lib/Twitter');

var fs = require('fs');
var express = require('express'),
  requireProxy = require('express-request-proxy'),
  port = process.env.PORT || 3000,
  app = express();

module.exports = require('./lib/Twitter');

var repetitions = 1;
var max_reps = 5; //each rep is 100 tweets
var ids = [];
var bodies = [];
var positives = 0;
var negatives = 0;
var searchKey = 'Sammamish';

//Callback functions
var error = function (err, response, body) {
  console.log('ERROR [%s]', err);
  console.log(err);
  console.log(response);
  console.log(body);
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
var dictionary = JSON.parse(fs.readFileSync('js/model/sentiment_dictionary.json'));

function formatDate(date) {
  date = date.toString();
  date = date.replace(/[ :\-()]/g, '');
  return date;
}

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
    if (repetitions < max_reps) {
      setTimeout(function(){nextSearch(lastID, keyword, response);},250);
    } else {  //finished searching
      var final = processTweets(bodies);
      final.push(keyword);
      var sentiment;
      if (final[0] > 0) {sentiment = 'positive';}
      if (final[0] < 0) {sentiment = 'negative';}
      if (final[0] === 0) {sentiment = 'neutral';}
      final.push(sentiment);
      console.log('this is the data ' + final);
      final.push( formatDate(new Date()) );
      response.json(final);
    }
  });
}

app.get('/search/*', function(request, response) {
  positives = 0;
  negatives = 0;
  bodies = [];  //tweet bodies
  ids = [];
  var keyword = arguments[0].params['0'];

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
    setTimeout(function() {nextSearch(lastID, keyword, response);}, 250);
  });
});

app.use(express.static('./'));

//share stuff--------------------
app.set('views', '.');
app.set('view engine', 'ejs');
app.get('/share/*', function(request, response) {
//this will send an HTML document with the chart filled in
  //--parse query
  var term1 = arguments[0].params['0'];
  var sentiment1 = arguments[0].query['sent1'];
  var score1 = parseInt(arguments[0].query['s1']);
  var pos1 = parseInt(arguments[0].query['p1']);
  var neg1 = parseInt(arguments[0].query['n1']);
  var neu1 = parseInt(arguments[0].query['neu1']);
  var tot1 = pos1 + neg1 + neu1;
  var date1 = arguments[0].query['d1'];

  var term2 = arguments[0].query['t2'];
  var sentiment2 = arguments[0].query['sent2'];
  var score2 = parseInt(arguments[0].query['s2']);
  var pos2 = parseInt(arguments[0].query['p2']);
  var neg2 = parseInt(arguments[0].query['n2']);
  var neu2 = parseInt(arguments[0].query['neu2']);
  var tot2 = pos2 + neg2 + neu2;
  var date2 = arguments[0].query['d2'];

  dataR = [term1, sentiment1, score1, pos1, neg1, neu1, tot1, date1, term2, sentiment2, score2, pos2, neg2, neu2, tot2, date1];
  response.render('share', {data: dataR});
});
//------------------------

app.get('*', function(request, response) {
  response.sendFile('index.html', { root: '.' });
});

app.listen(port, function() {
  console.log('Server started on port ' + port + '!');
});
