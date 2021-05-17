///////////////////////////////
// DEPENDENCIES
////////////////////////////////
require("dotenv").config()

const {PORT=3000, MONGODB_URL} = process.env

const express = require("express")

const app = express()

const mongoose = require("mongoose")

const cors = require("cors")

const morgan = require("morgan")



///////////////////////////////
// DB CONNECTION
////////////////////////////////
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
});

mongoose.connection
    .on("open", () => console.log("YOU ARE CONNECTED TO MONGOOSE"))
    .on("close", () => console.log("YOU ARE DISCONNECTED FROM MONGOOSE"))
    .on("error", (error) => console.log(error))


///////////////////////////////
// MODELS
////////////////////////////////
const JournalSchema = new mongoose.Schema({
    name: String,
    title: String,
    date: String,
    entry: String,
})

const Journal = mongoose.model("Journal", JournalSchema)



///////////////////////////////
// MiddleWare
////////////////////////////////
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())



///////////////////////////////
// ROUTES
////////////////////////////////
app.get('/', (req, res) => {
    res.send("Hello Garrett")
})

app.get("/journal", async (req, res) => {
    try{
        res.json(await Journal.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})

app.post("/journal", async (req, res) => {
    try {
        res.json(await Journal.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
})

app.put('/journal/:id', async (req,res) => {
    try{
        await Journal.findByIdAndUpdate(req.params.id, req.body, {new:true})
    } catch (error) {
        res.status(400).json(error)
    }
})

app.delete("/journal/:id", async (req, res) => {
    try {
        res.json(await Journal.findByIdAndDelete(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})



///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))