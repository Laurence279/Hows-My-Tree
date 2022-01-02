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

import bcrypt from "bcrypt"
const saltRounds = 10;


const __filename = fileURLToPath(
    import.meta.url)
const __dirname = dirname(__filename)

import ejs from "ejs"

const app = express();
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs');
app.use("/trees", router);

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