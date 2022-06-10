// import the dependencies
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-Parser')
const {verifyToken} = require("./validation")


// swagger dependencies
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

// create the app object
const app = express();

// config the .env file 
require('dotenv-flow').config();

// setup swagger 
const swaggerDefinition = YAML.load('./swagger.yaml')
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition))

// import routes
const stockRoutes = require("./routes/stock");
const authRoutes = require("./routes/auth");


// parse request of content-type JSON   
app.use(bodyParser.json());


// Handle CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "auth-token, Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


// connect with database: MongoDB using Mongoose ODM 
mongoose.connect
(
    process.env.DBHOST, 
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
).catch(error => console.log("Error connecting to MongoDB: " + error));

mongoose.connection.once('open', () => console.log("Connected successfully to MongoDB"))

// routes definitions
// get routes: Welcome route  
app.get("/api/Welcome", (req, res) => {
    res.status(200).send({message: 'Welcome to the Neo-Stocks RESTful API'})
})


// authentication routes to secure the API endpoints 
app.use("/api/stocks", verifyToken, stockRoutes); // CRUD routes 
app.use("/api/user", authRoutes); // auth routes: register and login 


// create port variable
const PORT = process.env.PORT || 4000;

// start up the server 
app.listen(PORT, () => {
    console.log("Sever is running on port: " + PORT);
})

module.exports = app;
