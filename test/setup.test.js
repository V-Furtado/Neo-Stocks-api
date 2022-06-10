// change the environment
process.env.NODE_ENV = 'test';

const Stock = require('../models/stock')
const User = require('../models/user')

before((done)=> {
    Stock.deleteMany({}, function(err){});
    User.deleteMany({}, function(err){});
    done();
})


after((done)=> {
    User.deleteMany({}, function(err){});
    Stock.deleteMany({}, function(err){});
    done();
})