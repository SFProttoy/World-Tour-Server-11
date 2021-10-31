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
    const bookingCollection = database.collection("bookings");

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

    // Add a new Tour
    app.post("/offers", async (req, res) => {
      const offer = req.body;
      const result = await offerCollection.insertOne(offer);
      res.send(result);
    });

    // POST bookings API

    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });

    // all bookings

    app.get("/bookings", async (req, res) => {
      const cursor = await bookingCollection.find({});
      const bookings = await cursor.toArray();
      res.send(bookings);
    });

    // my bookings

    app.get("/bookings/:email", async (req, res) => {
      const result = await bookingCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });

    // delete booking

    app.delete("/bookings/:id", async (req, res) => {
      const result = await bookingCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });

      res.send(result);
    });

    // Update status

    app.put("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const updateUserStatus = req.body;
      const filter = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          status: updateUserStatus.status,
        },
      };
      const result = await bookingCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running the Server");
});

app.listen(port, () => {
  console.log("WorldTour Server port", port);
});
