"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');

const mongoose = require('mongoose'); 
const faker = require('faker');
const expect = require('chai').expect;

const { TEST_DATABASE_URL } = require('../config');
const { app, runServer, closeServer } = require('../server');
const { Order, Menu, User, Dish, Beverage } = require('../models');

chai.use(chaiHttp);

let user, userId, newToken, dish, orderId;

user = new User({
	name: 'fake',
	email: 'fake@test.com',
	password: 'password'
});

dish = new Dish({
	name: 'Fish Tacos',
	description: 'Served with special hot sauce',
	price: faker.commerce.price()
});

function seedDishData() {
	console.log('seeding dish data');
	const seedData = [];

	for (let i = 0; i <= 1; i++) {
		seedData.push(dish);
	}
	return Dish.insertMany(seedData);
}


function tearDownDb() {
	console.warn('Deleting database');
	return mongoose.connection.dropDatabase();
}


describe('Order Inn API', () => {

	before(function () {
		runServer(TEST_DATABASE_URL);
	});

	before(function () {
		seedDishData();
	});

	before(function (done) {

		chai.request(app)
			.post('/guests')
			.send(user)
			.end(function (err, res) {
				newToken = res.body.authToken;
				done();
			});
	});

	after(function () {
		return tearDownDb();
	});

	after(function () {
		return closeServer();
	});

	it('should login', function (done) {
		chai.request(app)
			.post('/login')
			.send({
				email: user.email,
				password: user.password
			})
			.end(function (err, res) {
				userId = res.body.user_id;
				expect(res).to.have.status(200);
				done();
			});
	});

	it('should /GET dishes', function (done) {

		chai.request(app)
			.get('/dishes')
			.set('Authorization', 'Bearer ' + newToken)
			.end(function (err, res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				done();
			});
	});

	it('should /POST orders', function (done) {

		let newOrder = {
			guests: userId,
			dishes: [dish._id],
			deliveryDate: Date.now(),
			location: 'Rooftop',
			notes: 'More hot sauce'
		}

		chai.request(app)
			.post('/orders')
			.send(newOrder)
			.set('Authorization', 'Bearer ' + newToken)
			.end(function (err, res) {
				expect(res).to.have.status(201);
				orderId = res.body._id;
				done();
			});
	});

	it('should /DELETE order', function (done) {

		chai.request(app)
			.delete('/orders/' + orderId)
			.set('Authorization', 'Bearer ' + newToken)
			.end(function (err, res) {
				expect(res).to.have.status(204);
				done();
			})
	});

});

describe('index page', function () {
	it('should exist', function () {
		return chai.request(app)
			.get('/')
			.then(function (res) {
				expect(res).to.have.status(200);
			});
	});
});
