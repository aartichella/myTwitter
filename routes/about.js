var ejs = require("ejs");

var crypto = require('crypto');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var connectionpool = require('./connectionpool');

exports.render = function(req, res){	
	 res.render('about');	
};
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
function insertUserData(statusHandler, query){
	//var connection = sql_connection();
	var connection=connectionpool.getConnectionFromPool();
	
	connection.query(query, function(err, rows, fields) {
		  if (err) statusHandler();
		  console.log('The solution is: ', rows);
		});
	//
	connectionpool.releaseConnection(connection);
	
}
exports.storedb = function(req,res){
	var birthday = req.body.birthday;
	var contact = req.body.contact;
	var location = req.body.location;
	if(req.session) console.log(req.session) 
	else console.log('no session');
	var tw_handle = '@'+req.session.fullname;
	console.log(tw_handle);
	var json_responses;
	if(birthday!== ''  && contact!== '' && location!== '')
	   {
	      console.log(birthday+" "+contact+" "+location);
	               //Assigning the session
	  
    
	var query = "insert into tbl_users(birthday,contact, location)VALUES ('"+ birthday + "','" + contact + "','" +location+"') where tweeter_handle = '"+tw_handle+"'"; 
	insertUserData(function(err,results){
        if(err){
           throw err;
        }
        else 
        {
        //req.session.fullname = fullname;
        console.log("about information initialized");
        //json_responses = {"statusCode" : 200};
        //res.send(json_responses);
       	
       	 res.render('profile');	
       
        }
     },query);
  }
	else
	{
	      json_responses = {"statusCode" : 401};
	      res.send(json_responses);
	}
};