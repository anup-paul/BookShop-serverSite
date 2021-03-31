const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()



const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 7000




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4mhth.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookDataCollection = client.db(process.env.DB_NAME).collection("books");
  const addBookDataCollection = client.db(process.env.DB_NAME).collection("addBooks");

  console.log(" Successfully connected done");


  app.post('/addBook', (req, res) => {
    const newBookData = req.body;
    console.log('add new book info', newBookData);
    bookDataCollection.insertOne(newBookData)
      .then(result => {
        res.send(result)
      })
  })


  app.get('/books', (req, res) => {
    bookDataCollection.find({})
      .toArray((err, items) => {
        res.send(items)
      })
  })



  app.get('/selectedBook/:id', (req, res) => {
    bookDataCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, item) => {
        res.send(item);
      })
  })



 app.post('/addOrder', (req, res)=>
 {
   const newOrder = req.body;
   console.log(newOrder);
   addBookDataCollection.insertOne(newOrder)  
   .then(result =>
    {
      console.log(result)
      // res.send(result.insertedCount)
    })
 })


 app.get('/orders',(req,res)=>
 {
  addBookDataCollection.find({email:req.query.email})
   .toArray((err, results)=>
   {
     res.send(results)
   })
 })



  app.delete('/delete/:id', (req,res)=>
  {
    bookDataCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then(result =>
      {
        console.log(result);
      })
  })

});



app.listen(port)