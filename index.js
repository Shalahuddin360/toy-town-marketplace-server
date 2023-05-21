const express = require('express');
require('dotenv').config()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pjz0bfk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
    // useNewUrlParser:true,
    // useUnifiedTopology:true,
    // maxPoolSize:10

});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        client.connect((err) => {
            if (err) {
                console.error(err);
                return;
            }
        }); //await
        const toyCollection = client.db('toyDB').collection('toy');

        app.get("/allToys/:text", async (req, res) => {
            console.log(req.params.text)
            if (req.params.text == "scooter" || req.params.text == "drone" || req.params.text == "stroller") {
                const result = await toyCollection
                    .find({ status: req.params.text })
                    // .sort({price:"-1"})
                    .toArray();
                console.log(result)
                return res.send(result);
            }
            const result = await toyCollection
                .find({})
                // .sort({price:"1"})
                .toArray();
            res.send(result)
        })

        //  app.get("/allToys/:id", async (req,res)=>{
        //     const id =req.params.id;
        //     const query ={_id : new ObjectId (id)}
        //     const result = await toyCollection.findOne(query)
        //     res.send(result)
        //  })

        app.post("/postToy", async (req, res) => {
            const newToy = req.body;

            if (!newToy) {
                return res.status(404).send({ message: 'newToy data not valid request' })
            }
            // console.log(newToy)
            const result = await toyCollection.insertOne(newToy)
            res.send(result)
        })

        app.get("/singleToy/:id", async (req, res) => {
            console.log(req.params.id);
            const result = await toyCollection.findOne({
              _id: new ObjectId(req.params.id),
            });
            res.send(result);
          });

        app.get("/myToys/:email", async (req, res) => {
            console.log(req.params.email);
            const result = await toyCollection.find({email: req.params.email}).toArray();
            console.log(result)
            res.send(result);
         
        });



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('toy town is running')
})
app.listen(port, () => {
    console.log(`toy town server is running on port ${port}`)
})