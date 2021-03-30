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

app.get('/', (req, res) => {
  res.send('Hello World!')
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4mhth.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookDataCollection = client.db(process.env.DB_NAME).collection("books");
    
  console.log(" Successfully connected done")
  app.post('/addBook',(req, res)=>
  {
      const newBookData = req.body;
      console.log('add new book info',newBookData);
      bookDataCollection.insertOne(newBookData)
      .then(result=>
        {
            res.send(result)
        })
  })


  app.get('/books',(req, res)=>
  {
      bookDataCollection.find({})
      .toArray((err,items)=>
      {
          res.send(items)
      })
  })
  
});



app.listen(port)