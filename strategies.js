'use strict';

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const JWT_SECRET = require('./config');

const jwtStrategy = new JwtStrategy({
    secretOrKey: JWT_SECRET,
    // Look for the JWT as a Bearer auth header
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
    algorithms: ['HS256']
  },
  (payload, done) => {
    console.log('hello');
    done(null, payload.guest);
  }
);

module.exports = { jwtStrategy };
