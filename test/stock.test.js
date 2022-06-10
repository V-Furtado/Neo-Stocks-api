
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server')

chai.use(chaiHttp);



describe('user stock tests', () => {

    it('should register + login a user, create stock and verify 1 in db', (done) => {

        // 1) register new user
        let user = {
            name: "john Doe",
            email: "john@example.com",
            password: "123000"
        }
        chai.request(server)
            .post('/api/user/register')
            .send(user)
            .end((err, res) => {
                
                // asserts
                expect(res.status).to.be.equal(200);   
                expect(res.body).to.be.a('object');
                expect(res.body.error).to.be.equal(null);
               
                // 2) login the user
                chai.request(server)
                    .post('/api/user/login')
                    .send({
                        "email": "john@example.com",
                        "password": "123000"
                    })
                    .end((err, res) => {
                        // asserts                        
                        expect(res.status).to.be.equal(200);
                        expect(res.body.error).to.be.equal(null);                        
                        let token = res.body.data.token;

                        // 3) create new stock
                        let stock = {
                            name: "test",
                            symbol:"test",
                            price: 00,
                            ipoDate: "test",
                            exchange: "test",
                            inTheTop20: false
                        }

                        chai.request(server)
                            .post('/api/stocks')
                            .set({ "auth-token": token })
                            .send(stock)
                            .end((err, res) => {
                                
                                // asserts
                                expect(res.status).to.be.equal(201);                                
                                expect(res.body).to.be.a('array');
                                expect(res.body.length).to.be.eql(1);
                                
                                let savedstock = res.body[0];
                                expect(savedstock.name).to.be.equal(stock.name);
                                expect(savedstock.symbol).to.be.equal(stock.symbol);
                                expect(savedstock.price).to.be.equal(stock.price);
                                expect(savedstock.ipoDate).to.be.equal(stock.ipoDate);
                                expect(savedstock.exchange).to.be.equal(stock.exchange);
                                expect(savedstock.inTheTop20).to.be.equal(stock.inTheTop20);


                                // 4) verify one stock in test db
                                chai.request(server)
                                    .get('/api/stocks')
                                    .end((err, res) => {
                                        
                                        // asserts
                                        expect(res.status).to.be.equal(200);                                
                                        expect(res.body).to.be.a('array');                                
                                        expect(res.body.length).to.be.eql(1);
                                
                                        done();
                                    });
                            });
                    });
            });
    });

    it('should register + login a user, create stock and delete it from db', (done) => {

        // 1) register new user
        let user = {
            name: "john Doe",
            email: "john@example.com",
            password: "123000"
        }
        chai.request(server)
            .post('/api/user/register')
            .send(user)
            .end((err, res) => {
                
                // asserts
                expect(res.status).to.be.equal(200);   
                expect(res.body).to.be.a('object');
                expect(res.body.error).to.be.equal(null);
                
                // 2) login the user
                chai.request(server)
                    .post('/api/user/login')
                    .send({
                        "email": "john@example.com",
                        "password": "123000"
                    })
                    .end((err, res) => {
                        // asserts                        
                        expect(res.status).to.be.equal(200);                         
                        expect(res.body.error).to.be.equal(null);                        
                        let token = res.body.data.token;

                        // 3) create new stock
                        let stock = {
                            name: "test",
                            symbol:"test",
                            price: 00,
                            ipoDate: "test",
                            exchange: "test",
                            inTheTop20: false
                        }

                        chai.request(server)
                            .post('/api/stocks')
                            .set({ "auth-token": token })
                            .send(stock)
                            .end((err, res) => {
                                
                                // asserts
                                expect(res.status).to.be.equal(201);                                
                                expect(res.body).to.be.a('array');
                                expect(res.body.length).to.be.eql(1);
                                
                                let savedstock = res.body[0];
                                expect(savedstock.name).to.be.equal(stock.name);
                                expect(savedstock.symbol).to.be.equal(stock.symbol);
                                expect(savedstock.price).to.be.equal(stock.price);
                                expect(savedstock.ipoDate).to.be.equal(stock.ipoDate);
                                expect(savedstock.exchange).to.be.equal(stock.exchange);
                                expect(savedstock.inTheTop20).to.be.equal(stock.inTheTop20);

                                // 4) delete stock
                                chai.request(server)
                                    .delete('/api/stocks/' + savedstock._id)
                                    .set({ "auth-token": token })
                                    .end((err, res) => {
                                        
                                        // asserts
                                        expect(res.status).to.be.equal(200);                                        
                                        const actualval = res.body.message;
                                        expect(actualval).to.be.equal('stock was deleted successfully!');        
                                        done();
                                    });
                            });
                    });
            });
    });

    it('should register user with invalid input', (done) => {

        // 1) register new user with invalid inputs
        let user = {
            name: "john Doe",
            email: "john@example.com",
            password: "1234" //faulty password - joi/validation should catch this...
        }
        chai.request(server)
            .post('/api/user/register')
            .send(user)
            .end((err, res) => {
                                
                // asserts
                expect(res.status).to.be.equal(400); //normal expect with no custom output message
                //expect(res.status,"status is not 400 (not found)").to.be.equal(400); //custom output message at fail
                
                expect(res.body).to.be.a('object');
                expect(res.body.error).to.be.equal("\"password\" length must be at least 6 characters long");  
                done();              
            });
    });
});
