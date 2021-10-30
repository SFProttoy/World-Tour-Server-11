const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2r10p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("world_tour");
    const offerCollection = database.collection("offers");

    // GET Offers API
    app.get("/offers", async (req, res) => {
      const cursor = offerCollection.find({});
      const offers = await cursor.toArray();
      res.send(offers);
    });

    // GET Single Offer

    app.get("/offers/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const offer = await offerCollection.findOne(query);
      res.send(offer);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running the Server");
});

//   app.get("/hello", (req, res) => {
//     res.send("Hello Updated Here");
//   });

app.listen(port, () => {
  console.log("WorldTour Server port", port);
});
