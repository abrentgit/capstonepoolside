"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');

const mongoose = require('mongoose'); 
const faker = require('faker');
const expect = require('chai').expect;
const should = chai.should();

const { TEST_DATABASE_URL } = require('../config');
const { app, runServer, closeServer, authToken, verifyUser, createAuthToken } = require('../server');
const { Order, Menu, User, Dish, Beverage } = require('../models');

chai.use(chaiHttp);

const authUser = {
	email: 'fake@email.com', 
	password: 'password'
}

const newUser = {
	name: 'Fake Person',
	email: 'fake@email.com',
	password: 'password'
}

function generateDishData() {
	return {
		name: faker.commerce.productName(),
		description: faker.commerce.productMaterial(),
		price: faker.commerce.price()
	}
}

function seedDishData() {
	console.log('seeding dish data');
	const seedData = [];

	for (let i = 0; i <= 10; i++) {
		seedData.push(generateDishData());
	}
	return Dish.insertMany(seedData);
}

function tearDownDb() {
	console.warn('Deleting database');
	return mongoose.connection.dropDatabase();
}

describe('Pre Test Hooks', function() {
	
	let loginToken = '';
	let userId = '';
	
	before(function() {
		console.log('test server is running!!!')
		runServer(TEST_DATABASE_URL);
	})

	//seed dishes
	before(function() {
		seedDishData();
	})
	
	//REGISTER
	before(function(done) {
		chai.request(app)
		.post('/guests')
		.send(newUser)
		.end(function(err, res) {
			console.log(res, 'THIS IS REGISTERED USER')
			expect(res.statusCode).to.equal(201);
			done();
		})
	})
	
	before(function(done){
		chai.request(app)
		.post('/login')
		.send(authUser)
	    .end(function(err, res){
			console.log(res, 'USER IS BEING LOGGED IN')
			expect(res.statusCode).to.equal(200);
			console.log(loginToken)
			loginToken = res.body.authToken;
			userId = res.body.userId;
			done();
	    });
	});
	
	after(function() {
		return tearDownDb();
	});
	
	after(function() {
		return closeServer();
	});

	it('should /GET Dishes', function() {
		chai.request(app)
		.get('/dishes')
		.send(authUser)
		.end(function(res) {
			expect(res.statusCode).to.equal(401);
		});
	});

	// it('should /POST Order', function(done) {

	// 	// set up mock order with userId 		
	// 	// let mockOrder = {
	// 	// 	guests: userId,
	// 	// 	dishes: 
	// 	// 	deliveryDate:
	// 	// 	location: 
	// 	// 	notes:
	// 	// }

	// 	chai.request(app)
	// 	.post('/orders')
	// 	.set('Authorization', 'Bearer' + loginToken)
	// 	.send(authUser)
	// 	.end(function(err, res) {
	// 		expect(res.statusCode).to.equal(200);
	// 		done();
	// 	})
	// })

});





