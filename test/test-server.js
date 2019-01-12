"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');

const mongoose = require('mongoose'); 
const faker = require('faker');
const expect = require('chai').expect;
const should = chai.should();
const jwt = require('jsonwebtoken');


const { TEST_DATABASE_URL } = require('../config');
const { app, runServer, closeServer, authToken, verifyUser, createAuthToken } = require('../server');
const { Order, Menu, User, Dish, Beverage } = require('../models');
const { JWT_SECRET } = require('../config');


chai.use(chaiHttp);

function tearDownDb() {
	console.warn('Deleting database');
	return mongoose.connection.dropDatabase();
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

let newToken;

describe('Order Inn API', () => {
	let user;
	
	before(function() {
		console.log('test server is running!!!')
		runServer(TEST_DATABASE_URL);
	})

	//seed dishes
	before(function() {
		seedDishData();
	})

	user = new User({
		name: 'fake', 
		email: 'fake@test.com', 
		password: 'password'
	})

	before(function(done) {
            chai.request(app)
                .post('/guests')
                .send(user)
                .end(function(err, res){
					if ( err ) throw err;
					console.log(res, 'THIS IS POST RE')
                    newToken = res.body.authToken;
                    done();
                });
	});
			
	after(function() {
		return tearDownDb();
	});
	
	after(function() {
		return closeServer();
	});

	it('should login', function(done) {
        chai.request(app)
          .post('/login')
          .send({email:user.email, password:user.password})
          .end(function(err, res) {
			console.log(res, 'THIS IS lOGIN RES')
            if (err) return done(err);
            done();
          });
	});
	
    it('should return 401 due to protected endpoint', function(done) {

		console.log(newToken, 'this is token')

		chai.request(app)
			.get('/dishes')
            .set('Authorization', 'Bearer ' + newToken)
			.end(function(err, res) {
				console.log(res, 'THIS IS DISHES RES')
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				if (err) return done(err);
				done();
			});
		});
});



