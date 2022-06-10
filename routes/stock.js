// import the router
const router = require("express").Router();
const stock = require("../models/stock")

// CRUD operations

// /api/stocks/
// Create stock - post stock
router.post("/", (req, res)=> {
    // get the data 
    data = req.body;
    stock.insertMany(data)
    .then(data => {res.send(data); })
    .catch(err => {res.status(500).send({message: err.message}); })
})

// /api/stocks/
// Read all the stocks - get stocks 
router.get("/", (req, res)=> {
    // find the data 
    stock.find()
    .then(data => {res.send(data); })
    .catch(err => {res.status(500).send({message: err.message}); })
})

// /api/stocks/inTheTop20
// Read all the stock in the Top 20 - get 
router.get("/inTheTop20", (req, res)=> {
    // find the data 
    stock.find({inTheTop20: true})
    .then(data => {res.send(data); })
    .catch(err => {res.status(500).send({message: err.message}); })
})

 
// /api/stocks/id
// Read a specific stock  - get
router.get("/:id", (req, res)=> {
    // find the data by id.
    stock.findById(req.params.id)
    .then(data => {res.send(data); })
    .catch(err => {res.status(500).send({message: err.message}); })
})


// Update a specific stock - put 
router.put("/:id", (req, res)=> {
    // find the data by id and update
    const id = req.params.id;

    stock.findByIdAndUpdate(id, req.body)
    .then(data => { 
        !data ? res.status(404).send({message: "Cannot update stock with id= " + id + ". Maybe stock was not found" })
        : res.send({message: "Stock was successfully updated."})
            
    })
    .catch(err => {res.status(500).send({message: "Error updating stock with id= " + id });})
})


// Delete a specific stock - delete
router.delete("/:id", (req, res)=> {
    // find the data by id and delete it.
    const id = req.params.id;

    stock.findByIdAndDelete(id)
    .then(data => { 
        !data ? res.status(404).send({message: "Cannot delete stock with id= " + id + ". Maybe stock was not found" })
        : res.send({message: "Stock was successfully deleted."})
            
    })
    .catch(err => {res.status(500).send({message: "Error deleting stock with id= " + id });})
})

// export the routes 
module.exports = router;
