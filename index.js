const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ufmbf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 4200

app.get('/',(req, res)=>{
  res.send('welcome to my server')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const furnitureCollection = client.db("furnitureStore").collection("furniture");
  const orderCollection = client.db("furnitureStore").collection("orders");
 

// add Furniture
 app.post('/addProduct',(req, res) => {
    const newFurniture = req.body;
    furnitureCollection.insertOne(newFurniture)
    .then(result => {
      res.send(result.insertedCount>0)
    })
  })

// get Furniture
  app.get('/furnitures',(req, res)=>{
    furnitureCollection.find()
    .toArray((err, furniture) =>{
      res.send(furniture)
    })
  })

//get single Furniture
  app.get('/checkOut/:id',(req, res) =>{
    const id = ObjectID(req.params.id)
    furnitureCollection.find({_id : id})
    .toArray((err,documents) => {
      res.send(documents[0]);
    })
  })

//add all the oder into the new collection
  app.post('/orderDetails', (req, res) => {
    const newProduct = req.body;
    orderCollection.insertOne(newProduct)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

// get all the order
  app.get('/allOrders', (req, res) => {
    orderCollection.find({ email: req.query.email })
      .toArray((err, orders) => {
        res.send(orders);
      })
  })

// delete Furniture details
  app.delete('/deleteProduct/:id', (req, res) => {
    const id = ObjectID(req.params.id)
    furnitureCollection.deleteOne({ _id: id })
      .then(result => {
        res.send(result.deletedCount > 0)
      })
  })

});
app.listen(port)
