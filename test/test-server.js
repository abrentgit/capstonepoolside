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
      guests: [],
      deliveryDate: faker.date.recent(),
      location: faker.lorem.word(),
      notes: faker.lorem.words(),
      dishes: generateDishData(),
      beverages: generateBeverageData()
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
    
    // it('should list users on GET', function() {
    //   let res; 
    //   return chai.request(app)
    //     .get('/orders')
    //     .then(function(_res) {
    //       res = _res;
    //       expect(res).to.have.status(200);
    //       expect(res.body.orders).to.have.lengthOf.at.least(1);
    //       return Order.countDocuments();
    //   });
    // });

  // AUTH 
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
    // }).finally(done);
  });


    it('should return orders with right fields', function() {
      let resOrder;
      return chai.request(app)
        .get('/orders')
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
        
        // console.log(res.body.orders);
        resOrder = res.body.orders[0]; // one single order 
        // console.log(resOrder._id);
        return Order.findById(resOrder._id); //return's first order's ID
    })
      .then(function(order) {  
        expect(resOrder._id).to.equal(order.id);
        // expect(resOrder.deliveryDate).to.equal(order.deliveryDate); // format is different, how to convert it to equal same value?
        expect(resOrder.location).to.equal(order.location);
        expect(resOrder.notes).to.equal(order.notes);
        // expect(resOrder.beverages).to.eql(order.beverages);
        // expect(resOrder.dishes).to.eql(order.dishes);
        // console.log(resOrder.beverages);
        // console.log(order.beverages);
    });
  });

});
});
