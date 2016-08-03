// Much thanks to: https://github.com/BoyCook/TwitterJSClient.  The original file has been modified to the purpose of our project

var OAuth = require('oauth').OAuth;
var qs = require('qs');

function Twitter(config) {
  this.consumerKey = config.consumerKey;
  this.consumerSecret = config.consumerSecret;
  this.accessToken = config.accessToken;
  this.accessTokenSecret = config.accessTokenSecret;
  this.callBackUrl = config.callBackUrl;
  this.baseUrl = 'https://api.twitter.com/1.1';
  this.oauth = new OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      this.consumerKey,
      this.consumerSecret,
      '1.0',
      this.callBackUrl,
      'HMAC-SHA1'
  );
}

Twitter.prototype.getOAuthRequestToken = function (next) {
  this.oauth.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
    if (error) {
      console.log('ERROR: ' + error);
      next();
    }
    else {
      var oauth = {};
      oauth.token = oauth_token;
      oauth.token_secret = oauth_token_secret;
      console.log('oauth.token: ' + oauth.token);
      console.log('oauth.token_secret: ' + oauth.token_secret);
      next(oauth);
    }
  });
};

Twitter.prototype.getOAuthAccessToken = function (oauth, next) {
  this.oauth.getOAuthAccessToken(oauth.token, oauth.token_secret, oauth.verifier,
    function (error, oauth_access_token, oauth_access_token_secret, results) {
      if (error) {
        console.log('ERROR: ' + error);
        next();
      } else {
        oauth.access_token = oauth_access_token;
        oauth.access_token_secret = oauth_access_token_secret;
        console.log('oauth.token: ' + oauth.token);
        console.log('oauth.token_secret: ' + oauth.token_secret);
        console.log('oauth.access_token: ' + access_token.token);
        console.log('oauth.access_token_secret: ' + oauth.access_token_secret);
        next(oauth);
      }
    });
};

Twitter.prototype.getUserTimeline = function (params, error, success) {
  var path = '/statuses/user_timeline.json' + this.buildQS(params);
  var url = this.baseUrl + path;
  this.doRequest(url, error, success);
};

Twitter.prototype.getHomeTimeline = function (params, error, success) {
  var path = '/statuses/home_timeline.json' + this.buildQS(params);
  var url = this.baseUrl + path;
  this.doRequest(url, error, success);
};

Twitter.prototype.getTweet = function (params, error, success) {
  var path = '/statuses/show.json' + this.buildQS(params);
  var url = this.baseUrl + path;
  this.doRequest(url, error, success);
};

Twitter.prototype.getSearch = function (params, error, success) {
  var encodedQuery = encodeURIComponent(params.q);
  delete params.q;
  var path = '/search/tweets.json?q=' + encodedQuery + '&' + qs.stringify(params);
  var url = this.baseUrl + path;
  this.doRequest(url, error, success);
};

Twitter.prototype.getCustomApiCall = function (url, params, error, success) {
  var path =  url + this.buildQS(params);
  var url = this.baseUrl + path;
  this.doRequest(url, error, success);
};

Twitter.prototype.postCustomApiCall = function (url, params, error, success) {
  var path =  url + this.buildQS(params);
  var url = this.baseUrl + path;
  this.doPost(url, params, error, success);
};

Twitter.prototype.doRequest = function (url, error, success) {
  // Fix the mismatch between OAuth's  RFC3986's and Javascript's beliefs in what is right and wrong ;)
  // From https://github.com/ttezel/twit/blob/master/lib/oarequest.js
  url = url.replace(/\!/g, '%21')
    .replace(/\'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A');

  this.oauth.get(url, this.accessToken, this.accessTokenSecret, function (err, body, response) {
    console.log('URL [%s]', url);
    if (!err && response.statusCode == 200) {
      limits = {
        'x-rate-limit-limit': response.headers['x-rate-limit-limit'],
        'x-rate-limit-remaining': response.headers['x-rate-limit-remaining'],
        'x-rate-limit-reset': response.headers['x-rate-limit-reset'],
      };
      success(body, limits);
    } else {
      error(err, response, body);
    }
  });
};

Twitter.prototype.doPost = function (url, post_body, error, success) {
    // Fix the mismatch between OAuth's  RFC3986's and Javascript's beliefs in what is right and wrong ;)
    // From https://github.com/ttezel/twit/blob/master/lib/oarequest.js
  url = url.replace(/\!/g, '%21')
    .replace(/\'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A');
  //(url, oauth_token, oauth_token_secret, post_body, post_content_type, callback
  this.oauth.post(url, this.accessToken, this.accessTokenSecret, post_body, 'application/x-www-form-urlencoded', function (err, body, response) {
    console.log('URL [%s]', url);
    if (!err && response.statusCode == 200) {
      success(body);
    } else {
      error(err, response, body);
    }
  });
};

Twitter.prototype.buildQS = function (params) {
  if (params && Object.keys(params).length > 0) {
    return '?' + qs.stringify(params);
  }
  return '';
};

if (!(typeof exports === 'undefined')) {
  exports.Twitter = Twitter;
}
