"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../server.js");
const {runServer, closeServer} = require('../server.js');

const expect = chai.expect;

chai.use(chaiHttp);

// describe("index page", function() {
//   it("should exist", function() {
//     return chai
//       .request(app)
//       .get("/")
//       .then(function(res) {
//         expect(res).to.have.status(200);
//       });
//   });
// });

/// REQUEST TESTS

describe('orders', function() {
  before(function() {
    return runServer();
  });
  after(function() {
    return closeServer();
  });

  it('should list orders on GET', function() {
    return chai.request(app)
      .get('/orders')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.be.above(0);
        res.body.forEach(function(item) {
          expect(item).to.be.a('object');
          expect(item).to.have.all.keys(
            'id', 'guests', 'dishes', 'beverages', 'created_at', 'deliveryDate','notes');
        });
      });
  });

// CREATE NEW ORDER

  it('should add an order on POST', function() {
     const newOrder = {guests: 'James Peter', dishes: 'Supreme Burger', beverages: 'Agave Lemonade', deliveryDate: '2015-11-12', location: 'Pool', notes: 'Extra Ketchup'};
     return chai.request(app)
       .post('/orders')
       .send(newOrder)
       .then(function(res) {
         res.should.have.status(201);
         res.should.be.json;
         res.body.should.be.a('object'); // created at only in res?
         res.body.should.include.keys('id', 'guests', 'dishes', 'beverages', 'created_at', 'deliveryDate', 'location', 'notes');
         res.body.id.should.not.be.null;
         // response should be deep equal to `newItem` from above if we assign
         // `id` to it from `res.body.id`
         res.body.should.deep.equal(Object.assign(newOrder, {id: res.body.id}));
       });
   });

// UPDATE ORDER

   it('should update orders on PUT', function() {
       const updateData = {
         dishes: ['Supreme Burger', 'Filet Mignon'],
         beverages: 'Coffee',
         deliveryDate: '2015-11-12',
         notes: 'No pickles'
       };
       return chai.request(app)
         // first have to get orders
         .get('/orders')
         .then(function(res) {
           updateData.id = res.body[0].id;
           return chai.request(app)
             .put(`/orders/${updateData.id}`)
             .send(updateData)
         })
         .then(function(res) {
           expect(res).to.have.status(200);
           expect(res).to.be.json;
           expect(res.body).to.be.a('object');
           expect(res.body).to.deep.equal(updateData);
         });
     });

// DELETE ORDER BY ID

   it('should delete orders on DELETE', function() {
       return chai.request(app)
         .get('/orders')
         .then(function(res) {
           return chai.request(app)
             .delete(`/orders/${res.body[0].id}`);
         })
         .then(function(res) {
           expect(res).to.have.status(204);
         });
     });
});