var mysql = require('mysql');
var connectionpool = require('./connectionpool');

function sql_connection(){
	var connection = mysql.createConnection({
		  host     : 'localhost',
		  user     : 'root',
		  password : 'root123',
		  database : 'twitter',
		  port : 3306
		});
	return connection;
}

function makedbOperation(statusHandler, query){
	//var connection = sql_connection();
	var connection=connectionpool.getConnectionFromPool();
	var data_returned = '';
	connection.query(query, function(err, rows) {
		   statusHandler();
		 // console.log('The solution is: ', rows);
		  data_returned =  rows;
		 
		});
	connectionpool.releaseConnection(connection);
	return  data_returned;
}
function handledbconnection(err,results){
    var return_result = '';
	if(err){
    	console.log('in error insert user data');
    	console.log(err);
    	return_result = err;
    }
    else 
    {
    	console.log(results);
    	return_result = results;
    	console.log('db function successful');
    
    }
	return return_result;
 }
exports.sendtweets = function(req,res){
	var connection=connectionpool.getConnectionFromPool();
	var tweettext = req.body.tweetinfo;
	//console.log('fetching twitter handle from session : '+req.session.twitterhandle);
	var twitterhandle = "@"+req.session.twitterhandle;
	//console.log('got tweet');
	
	
	var query = "insert into tbl_tweet(tweettext,tweeter_handle)VALUES ('"+ tweettext + "','" + twitterhandle+"')";
	
	makedbOperation(handledbconnection,query);
	connectionpool.releaseConnection(connection);
	
	res.send(200);
}

exports.gettweets = function(req,res){
	//console.log('getting tweets for:'+req.session.twitterhandle);
	var connection=connectionpool.getConnectionFromPool();
	var twitterhandle = req.session.twitterhandle;
	if(!twitterhandle.indexOf('@')>=0) twitterhandle = '@'+twitterhandle;
	var query = "select timestamp,tweettext,tweeter_handle from tbl_tweet where tweeter_handle='"+twitterhandle+"'";
	//var data = makedbOperation(handledbconnection,query);
	
	var data_returned = '';
	connection.query(query, function(err, rows) {
		   
		  console.log('The solution is: ', rows);
		  data_returned =  rows;
		  res.json(rows);
		  
		});
	connectionpool.releaseConnection(connection);
	
}

exports.followPeople = function(req , res) {

	  // console.log("In follow People%%%%%%%");
	var connection=connectionpool.getConnectionFromPool();
	
	   var followerHandle = "@"+req.session.twitterhandle;
	   
	   var followingHandle = req.body.tweeter_handle;
	   var json_responses;
	   if(followerHandle!== '' && followingHandle!== '')
	   {
	      var query = "insert into tbl_followers(followingTwitterHandle, followerTwitterHandle)VALUES ('"+ followingHandle + "','" +followerHandle+"')";
	      connection.query(query, function(err, rows){
	         if(err){
	            throw err;
	         }
	         else
	         {
	            json_responses = {"status" : "following"};
	            res.json(rows);
	         }
	      });
	   }
	   else
	   {
	      json_responses = {"status" : "+follow"};
	      res.send(json_responses);
	   }
	   
	   connectionpool.releaseConnection(connection);
	}

exports.getFollowingList= function(req,res){
	var connection=connectionpool.getConnectionFromPool();
	   var twitterHandle=req.session.twitterhandle;
	   //if(twitterHandle.indexOf('@')<0) twitterHandle = '@'+twitterHandle;
	   var query="select * from tbl_followers where followerTwitterHandle='"+twitterHandle+"'";
	  // console.log("Query is:"+query);
	   connection.query(query, function(err, rows){
	      if(err){
	         throw err;
	      }
	      else
	      {
	         if(rows.length>0) {
	            res.json(rows);
	         }
	      }
	   });
	   connectionpool.releaseConnection(connection);
	}
exports.getFollowingTweets = function(req,res){
	var connection=connectionpool.getConnectionFromPool();
	var twitterHandle="@"+req.session.twitterhandle;
	var query = "select a.fullname, a.tweeter_handle,b.tweettext,b.timestamp,a.tweeter_handle,b.tweet_from from tbl_users a, tbl_tweet b " +
			"where a.tweeter_handle = b.tweeter_handle and a.tweeter_handle in (select tweeter_handle from tbl_tweet where tweeter_handle IN " +
			"(select followingTwitterHandle from tbl_followers where followerTwitterHandle ='"+twitterHandle+"') or tweeter_handle = '"
			+twitterHandle+"')";
	
	//console.log("Query is:"+query);
	   connection.query(query, function(err, rows){
	      if(err){
	         throw err;
	      }
	      else
	      {
	         if(rows.length>0) {
	            //console.log('getting tweets from who I follow');
	            //console.log(rows)
	        	//res.send(200); 
	            res.json(rows);
	         }
	      }
	   });
	   connectionpool.releaseConnection(connection);
}
exports.getAllUsers=function (req,res){
	var connection=connectionpool.getConnectionFromPool();   
	var twitterHandle="@"+req.session.twitterhandle;
	   var query="select * from tbl_users u where u.tweeter_handle NOT IN(select followingTwitterHandle from tbl_followers where followerTwitterHandle='"+ 
	   twitterHandle + "') and u.tweeter_handle != '" + twitterHandle + "'";
	   //console.log("Query is:"+query);
	   connection.query(query, function(err, rows){
	      if(err){
	         throw err;
	      }
	      else
	      {
	         for(var i=0;i<rows.length;i++)
	         {
	            var jsonstring = JSON.stringify(rows);
	            
	         }


	            res.send(rows);

	      }
	   });
	   connectionpool.releaseConnection(connection);
	}
exports.retweet = function(req,res){
	
	var connection=connectionpool.getConnectionFromPool();
	var tweet_from = req.body.owner;
	var tweet = req.body.text;
	var twitterHandle="@"+req.session.twitterhandle;
	var query="insert into tbl_tweet (tweettext,tweeter_handle,tweet_from) values ('"+tweet+"','"+twitterHandle+"','"+tweet_from+"')";
	   console.log("Query for retweet is:"+query);
	   connection.query(query, function(err, rows){
	      if(err){
	         throw err;
	         console.log('error in retweet')
	      }
	      else
	      {
	         
	    	  
	    	  if(rows.length>0) {
	        	 console.log(rows);
	            res.send(rows);
	         }
	    	  else{
	    		  console.log('printing for retweet');
	    		  console.log(rows);
	    		  res.send(200);
	    	  }
	      }
	   });
	   connectionpool.releaseConnection(connection);
}