import express, {
    urlencoded
} from "express";
import pg from "pg";
//Router for requests sent to /trees
import router from "./routes/trees.js";
import bcrypt from "bcrypt"

import {
    fileURLToPath
} from 'url'
import {
    dirname
} from 'path'

const saltRounds = 10;
const URL_VALIDATION = ["localhost:5432", "howsmytree.herokuapp.com"]


const __filename = fileURLToPath(
    import.meta.url)
const __dirname = dirname(__filename)


async function validate(req, res, next){
    const referer = req.headers.referer;
    if(!referer)
    {
        res.status(401).send("Unauthorised")
        return;
    }
    if(!isRefererValid(referer))
    {
        res.status(401).send("Unauthorised")
        return;
    }
    next();
}


const app = express();
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs');

app.use(validate);

app.use("/trees", router);

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index.html")
})

app.get("/plant", function (req, res) {
    res.sendFile(__dirname + "/public/create.html")
})

app.get("/about", async (req, res) => {
    res.sendFile(__dirname + "/public/about.html")
})


app.get("/:id", async (req, res) => {
    res.sendFile(__dirname + "/public/tree.html")
})

function isRefererValid(referer)
{
    let validated = false;
    
    URL_VALIDATION.forEach((string)=>{
        if(referer.includes(string)) validated = true;
    })
    if(validated) console.log("User made a successful request from:", referer);
    return validated
    
}



export default app;