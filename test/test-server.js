"use strict";

const chai = require('chai');
const chaiHttp = require('chai-http');

const mongoose = require('mongoose'); 
const faker = require('faker');

const expect = chai.expect;

const { TEST_DATABASE_URL } = require('../config');
const { app, runServer, closeServer, createAuthToken } = require('../server');
const { Order, User } = require('../models');

chai.use(chaiHttp);

function seedOrderData() {
  console.info('seeding order data');
  const seedData = [];
  
  for (let i = 0; i <= 5; i++) {
    seedData.push(generateOrderData());
  }
  return Order.insertMany(seedData); //inserts Orders into seed data
}

  // GENERATE FAKE ORDER
function generateOrderData() {
    return {
      deliveryDate: faker.date.recent(),
      location: faker.lorem.word(),
      notes: faker.lorem.words(),
      dishes: [generateDishData()],
      beverages: [generateBeverageData()]
   }
  }

function generateBeverageData() {
  return {
    name: faker.lorem.word(),
    description: faker.lorem.words(),
    price: faker.commerce.price()
  }
}

function generateDishData() {
  return {
    name: faker.lorem.word(),
    description: faker.lorem.words(),
    price: faker.commerce.price()
  }
}

// GENERATE FAKE USER
// function generateMenuData() {
//   return {
//     name: faker.lorem.word()
//   }
// }

// function generateUser() {
//   return {
//     name: faker.name.findName(),
//     email: faker.internet.email(),
//     password: faker.internet.password()
//   }
// };


function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Orders', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function(){
    return seedOrderData();
  })

  afterEach(function() {
    return tearDownDb();
  })

  after(function() {
    return closeServer();
  });

  describe('GET orders', function() {
  
  // can do before each function create user 
  // can do for admin just add role to that object 
  it('should return all existing orders on GET', (done) => {
    let res;
    let user = User.create({
      name: "Walter Brent",
      email: "again9@gmail.com",
      password: "kobe5rings"
    }).then(user => {
      const token = createAuthToken(user.serialize());
      return chai.request(app)
        .get('/orders') // endpoint for GET ORDERS
        .set ('Authorization', 'Bearer ' + token)
        .then(function(_res) {
          res = _res;
          expect(res.body.orders).to.have.lengthOf.at.least(1);
          expect(res).to.have.status(200);
          done();
        });
    });
  });
    // RIGHT FIELDS TEST 
    it('should return orders with right fields on GET orders', (done) => {
      let resOrder;
      let user = User.create({
        name: "Walter Brent",
        email: "again9@gmail.com",
        password: "kobe5rings"
      }).then(user => {
      const token = createAuthToken(user.serialize());
      return chai.request(app)
        .get('/orders')
        .set ('Authorization', 'Bearer ' + token)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.orders).to.be.a('array');
          expect(res.body.orders).to.have.lengthOf.at.least(1);

        res.body.orders.forEach(function(order) {
          expect(order).to.be.a('object');
          expect(order).to.include.keys(
          '_id', 'deliveryDate', 'location', 'notes', 'beverages', 'dishes');
        });

        resOrder = res.body.orders[0]; // one single order 
        return Order.findById(resOrder._id); //return's first order's ID
    })
      .then(function(order) {  
        expect(resOrder._id).to.equal(order.id); // comparing order in database to the response order requested
        expect(new Date(resOrder.deliveryDate)).to.own.include(order.deliveryDate); // own include, non-primitives with same information
        expect(resOrder.location).to.equal(order.location);
        expect(resOrder.notes).to.equal(order.notes);
        console.log(resOrder.dishes); // it is an array with an object inside
        // an array with an index that is a dish object 
        expect(resOrder.dishes).to.have.deep.members(order.dishes);
        expect(resOrder.beverages).to.have.deep.members(order.beverages);
        done();
      });
    });
    done();
    });
  });
});

