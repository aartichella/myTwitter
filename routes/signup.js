var ejs = require("ejs");
var express = require('express');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var connectionpool = require('./connectionpool');


exports.signup = function(req, res){
	
	 res.render('signup');	
	 
}

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
	var connection=connectionpool.getConnectionFromPool();
	
	connection.query(query, function(err, rows, fields) {
		   statusHandler();
		  console.log('The solution is: ', rows);
		});
	connectionpool.releaseConnection(connection);
}



function handler(){
	console.log('handling user status error/success');
}

exports.register = function(req, res){
	
	var fullname = req.body.fname+req.body.lname;
	var email = req.body.email;
	var password = req.body.pwd;
	
	var json_responses;
	if(fullname!== ''  && email!== '' && password!== '')
	   {
	      console.log(fullname+" "+email+" "+password);
	               //Assigning the session
	   var encryptedPassword = crypto
	    .createHash("md5")
	    .update(password)
	   .digest('hex');
	   
	var twitter_handle = '@' + fullname;
    
	var query = "insert into tbl_users(tweeter_handle,fullname, password, emailid)VALUES ('"+ twitter_handle + "','" + fullname + "','" +encryptedPassword+ "','" +email+"')"; 
	insertUserData(function(err,results){
        if(err){
        	console.log('in error insert user data');
        	console.log(err);
        	throw err;
        }
        else 
        {
        	if(req.session)
        		console.log(req.session)
        req.session.fullname = fullname;
        	console.log(req.session)
        console.log("Session initialized");
        json_responses = {"statusCode" : 200};
        res.send(json_responses);
        }
     },query);
  }
	else
	{
	      json_responses = {"statusCode" : 401};
	      res.send(json_responses);
	}
	
	res.redirect('/about');
	
};