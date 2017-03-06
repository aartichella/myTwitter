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

exports.getfollowers = function(req,res){
	var connection=connectionpool.getConnectionFromPool();
	 var twitterHandle="@"+req.session.twitterhandle;
	   
	   var query="select * from tbl_followers where followingTwitterHandle='"+twitterHandle+"'";
	   console.log("Query is:"+query);
	   connection.query(query, function(err, rows){
	      if(err){
	         throw err;
	      }
	      else
	      {
	         if(rows.length>0) {
	        	 console.log(rows)
	            res.json(rows);
	            
	         }
	      }
	   });
	   connectionpool.releaseConnection(connection);
}
exports.renderpage = function(req,res){
	res.render('followers');
}

exports.getfollowing = function(req,res){
	
	var connection=connectionpool.getConnectionFromPool();
	   var twitterHandle="@"+req.session.twitterhandle;
	   
	   var query="select * from tbl_followers where followerTwitterHandle='"+twitterHandle+"'";
	   console.log("Query is:"+query);
	   connection.query(query, function(err, rows){
	      if(err){
	         throw err;
	      }
	      else
	      {
	         if(rows.length>0) {
	        	 console.log(rows)
	            res.json(rows);
	            
	         }
	      }
	   });
	   connectionpool.releaseConnection(connection);
}