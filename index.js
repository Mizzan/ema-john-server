const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

// mongodb uri

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yk7ln.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// mongodb uri

const app = express();

// using bodyParser and cors
app.use(bodyParser.json());
app.use(cors());

const port = 5000;

app.get('/', (req, res) => {
  res.send('Welcome to ema-john e-commerce');
});
// mongodb
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productsCollection = client
    .db(process.env.DB_NAME)
    .collection('products');
  console.log('database connected');

  //   posting data to the database
  app.post('/addProduct', (req, res) => {
    const products = req.body;
    // console.log(product);
    productsCollection.insertOne(products).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount);
    });
  });

  // getting the all fakedata products from the mongodb database
  app.get('/products', (req, res) => {
    productsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  // getting the single fakeData product from the mongodb database
  app.get('/product/:key', (req, res) => {
    productsCollection
      .find({ key: req.params.key })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  //   creating review product
  app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
    productsCollection
      .find({ key: { $in: productKeys } })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });
});
// mongodb

app.listen(port);
