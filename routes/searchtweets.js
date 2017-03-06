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


exports.searchtweet = function(req,res){
	//get all tweets here
	var connection=connectionpool.getConnectionFromPool();
	var searchword = req.body.searchword;
	
	var query = 'select timestamp,tweettext,tweeter_handle from tbl_tweet';
	var data_returned = '';
	connection.query(query, function(err, rows) {
		   
		  console.log('The solution is: ', rows);
		  data_returned =  rows;
		  
		  res.send({
			  'redirect':'search',
			  'data' :rows
			  });
		  
		 
		  
		});
	connectionpool.releaseConnection(connection);
}
exports.searchpage = function(req,res){
	res.render('searchtweets');
}
	 
