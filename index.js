const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.llm45p4.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const foodCollection = client.db("FlavorFeast").collection("foods");
    const cartsCollection = client.db("FlavorFeast").collection("carts");

    app.post("/submit-form", async (req, res) => {
      const formData = req.body;
      const result = await foodCollection.insertOne(formData);
      res.send(result);
    });
    app.get("/cart", async (req, res) => {
      const result = await cartsCollection.find().toArray();
      res.send(result);
    });

    app.post("/cart", async (req, res) => {
      const cart = req.body;
      console.log(cart);
      const result = await cartsCollection.insertOne(cart);
      res.send(result);
    });

    app.get("/submit-form", async (req, res) => {
      const cursor = foodCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/product-details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await foodCollection.findOne(query);
      res.send(result);
    });
    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      console.log("delete data form data base", id);
      const query = { _id: new ObjectId(id) };
      const result = await cartsCollection.deleteOne(query);
      res.send(result);
    });
    app.put("/product-details/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const Product = req.body;
      const update2 = {
        $set: {
          name: Product.name,
          brandName: Product.brandName,
          category: Product.category,
          type: Product.type,
          price: Product.price,
          description: Product.description,
          rating: Product.rating,
          url: Product.url,
        },
      };
      const result = await foodCollection.updateOne(filter, update2, options);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("i love ayaka");
});
app.listen(port, () => {
  console.log(`Love Ayaka on ${port}`);
});
