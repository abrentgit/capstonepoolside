"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose'); 
const expect = chai.expect;

const { TEST_DATABASE_URL, PORT } = require('../config');
const { app, runServer, closeServer, createAuthToken } = require('../server');
const { Order, User } = require('../models');

chai.use(chaiHttp);

// TESTING ORDER RELATED POINTS
// IMPLEMENT MIDDLEWARE IN TEST?????

// const adminCredentials = {
//   "email": "tuck@see.com",
// 	"password": "tucky09"
// }

// const guestCredentials = {
// 	"email": "orlando@see.com",
// 	"password": "otown09"
// }

// let authenticatedUser = 

//GET ORDERS

describe('orders', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  // beforeEach(function() {
  //   // add authorization here
  // });

  after(function() {
    return closeServer();
  });

  it('should return all existing orders on GET', async (done) => {
    this.timeout(10000);
    let res;
    console.log('hello');
    console.log(done);
    let user = await User.create({
      name: "Walter Brent",
      email: "again9@gmail.com",
      password: "kobe5rings"
    });
    const token = createAuthToken(user.serialize());
    console.log(token);
    return await chai.request(app)
      .get('/orders') // endpoint for GET ORDERS
      .set ('Authorization', 'Bearer ' + token)
      .then(function(_res) {
        res = _res;
        // console.log(res.body);
        expect(res.body.orders).to.have.lengthOf.at.least(1);
        expect(res).to.have.status(200);
        return Order.countDocuments();
      });
    }).finally(done);
  });

  // it('should return orders with right fields', function() {
  //   // Strategy: Get back all orders, and ensure they have expected keys

  //   let resRestaurant;
  //   return chai.request(app)
  //     .get('/restaurants')
  //     .then(function(res) {
  //       expect(res).to.have.status(200);
  //       expect(res).to.be.json;
  //       expect(res.body.restaurants).to.be.a('array');
  //       expect(res.body.restaurants).to.have.lengthOf.at.least(1);

  //       res.body.restaurants.forEach(function(restaurant) {
  //         expect(restaurant).to.be.a('object');
  //         expect(restaurant).to.include.keys(
  //           'id', 'name', 'cuisine', 'borough', 'grade', 'address');
  //       });
  //       resRestaurant = res.body.restaurants[0];
  //       return Restaurant.findById(resRestaurant.id);
  //     })
  //     .then(function(restaurant) {

  //       expect(resRestaurant.id).to.equal(restaurant.id);
  //       expect(resRestaurant.name).to.equal(restaurant.name);
  //       expect(resRestaurant.cuisine).to.equal(restaurant.cuisine);
  //       expect(resRestaurant.borough).to.equal(restaurant.borough);
  //       expect(resRestaurant.address).to.contain(restaurant.address.building);

  //       expect(resRestaurant.grade).to.equal(restaurant.grade);
  //     });
  // });


module.exports = { app, runServer, closeServer };