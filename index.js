const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = 7000;

// using bodyParser and cors
app.use(bodyParser.json());
app.use(cors());

// mongodb
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yk7ln.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const products = client.db(process.env.DB_NAME).collection('products');
  // perform actions on the collection object
  app.post('/addProducts', (req, res) => {
    const product = req.body;
    products.insertOne(product).then((result) => {
      console.log(result);
    });
  });
});
// mongodb

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
