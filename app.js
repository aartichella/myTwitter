
/**
 * Twitter app.js
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , signup = require('./routes/signup')
  , profile = require('./routes/profile')
  , login = require('./routes/login')
  , http = require('http')
  , path = require('path'),
  about = require('./routes/about'),
  tweets = require('./routes/tweets'),
  searchtweets = require('./routes/searchtweets'),
  followers = require('./routes/followers');
  

var app = express();
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var session = require('cookie-session');
var mysql = require('mysql');
var connectionPool = require('./routes/connectionpool.js');
connectionPool.createPool(50,100);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser());
app.use(express.cookieSession({
	  key: 'app.sess',
	  secret: 'SUPERsekret'
	}));
app.use(express.session());


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
//middleware
//app.use(function(req, res, next) {
//	  if (req.session ) {
//	   
//	      console.log('use session availabel');
//	      console.log(req.sesssion)
//	        //req.user = user;
//	        //delete req.user.password; // delete the password from the session
//	       // req.session.user = user;  //refresh the session value
//	       // res.locals.user = user;
//	      }
//	  else{
//		  console.log('no user seesion in middleware')
//	  }
//	      // finishing processing the middleware and run the route
//	      next();
//	   
//	 
//	});
app.use(app.router);
app.get('/', routes.index);
app.get('/signup', signup.signup);
app.get('/about',about.render);
app.post('/register',signup.register);

app.post('/login', login.login);

app.get('/logout', function(req,res){
	console.log('if session exists')
	console.log(req.session)
	if(req.session)
		delete req.session; 
	res.redirect('/');
});

app.get('/home',function(req,res){
	res.render('profile');
})
app.get('/home',function(req,res){
	res.render('profile');
});
app.post('/profile', about.storedb);
app.post('/sendtweet',tweets.sendtweets);
app.get('/gettweets',tweets.gettweets);
app.get('/whotofollow',tweets.getAllUsers);
app.post('/searchtweet',searchtweets.searchtweet);
app.get('/search', searchtweets.searchpage);

app.post('/followpeople',tweets.followPeople);
app.get('/getFollowingTweets',tweets.getFollowingTweets);

app.get('/getfollowers',followers.getfollowers);
app.get('/followers',followers.renderpage);

app.get('/following',followers.renderpage);
app.get('/getfollowing',followers.getfollowing);

app.get('/getuser',function(req,res){
	res.send(req.session.twitterhandle);
})

app.post('/retweet',tweets.retweet);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
