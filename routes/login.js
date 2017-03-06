var ejs = require("ejs");
var mysql = require('mysql');
var crypto = require('crypto');
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

exports.login = function(req, res){
	var connection=connectionpool.getConnectionFromPool();
	var password = req.body.password;
	req.session.password = password;
	var handle = req.body.twitterhandle;
	req.session.twitterhandle = handle;
	handle = '@'+handle;
	//check if user exists in session
	  var encryptedPassword = crypto
	    .createHash("md5")
	    .update(password)
	   .digest('hex');
	 var query="select * from tbl_users where tweeter_handle='"+handle+"' and password='" + encryptedPassword +"'";
	 console.log(query);
	 connection.query(query, function(err, rows) {
		 
		   if(err){
			   res.send(400);
		   }
		   
		   else {
			  console.log(rows);
			   if(rows.length > 0){
				   console.log('user name password exists, loading profile');
				   res.send({
					   'redirect':'home',
					   'status':'success'});
			   }
			   else
				   res.send({
					   'error':'Incorrect username, password',
					   'status':'fail'});
		   }
	
		});
	
	 connectionpool.releaseConnection(connection);
};