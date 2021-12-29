import express, {
    urlencoded
} from "express";
import pg from "pg";
//Router for requests sent to /trees
import router from "./routes/trees.js";

import {
    fileURLToPath
} from 'url'
import {
    dirname
} from 'path'
const __filename = fileURLToPath(
    import.meta.url)
const __dirname = dirname(__filename)

import ejs from "ejs"




const app = express();
const PORT = 3000;
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs');
app.use("/trees", router);

// set up the server PORT
app.listen(PORT, function () {
    console.log(`Server listening on port ${PORT}`)
})

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index.html")
})

app.get("/plant", function (req, res) {
    res.sendFile(__dirname + "/public/create.html")
})

app.get("/:id", async (req, res) => {
    res.sendFile(__dirname + "/public/tree.html")
})

export default app;