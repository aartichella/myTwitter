/**
 * Test cases in Mocha
 */
var request = require('request')
, express = require('express')
,assert = require("assert")
,http = require("http");

describe('http tests', function(){

	it('should return the login if the url is correct', function(done){
		http.get('http://localhost:3000/', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});

	it('should not return the home page if the url is wrong', function(done){
		http.get('http://localhost:3000/dummy', function(res) {
			assert.equal(404, res.statusCode);
			done();
		})
	});
	it('should signup if the url is correct', function(done){
		http.get('http://localhost:3000/signup', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});
	it('should show profile if the url is correct', function(done){
		http.get('http://localhost:3000/about', function(res) {
			assert.equal(200, res.statusCode);
			done();
		})
	});

	it('should login', function(done) {
		request.post(
			    'http://localhost:3000/login',
			    { form: { twitterhandle: 'batman',password:'robin' } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
	it('should display the profile page', function(done) {
		request.post(
			    'http://localhost:3000/profile',
			    { form: { twitterhandle: 'batman',password:'robin' } },
			    function (error, response, body) {
			    	assert.equal(200, response.statusCode);
			    	done();
			    }
			);
	  });
});