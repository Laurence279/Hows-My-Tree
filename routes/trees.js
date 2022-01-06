// API routing information


import express from "express";
const router = express.Router();
import bcrypt from "bcrypt"
const saltRounds = 10;
import { DateTime, Interval } from "luxon";



import {
    getTrees,
    getTreeById,
    createTree,
    updateTreeById,
    replaceTreeById,
    deleteTreeById,
    getTreesByName
} from "../models/trees.js"
import app from "../app.js";
function getDate() {
    return DateTime.now();
}

function calculateGrowth(dateCreated, currentTime) {

    const ageInMins = Math.floor(Interval.fromDateTimes(dateCreated, currentTime).length('minutes'))
    let growth;

    if (ageInMins < 6000) {
        //Tree is < 4 days old.
        //Increment faster per min. (+0.1 per day)
        //After 4 days it will reach 0.3
        growth = ageInMins * 0.00006        
    } else if (ageInMins < 15000) {
        //Tree is between 4 - 10 days old.
        //Increment slower per min. (+0.05 per day)
        //After 6 days it will reach 0.6
        growth = (ageInMins - 6000) * 0.00003 + 0.36;
        // Growth is now calculated from the total summed growth so far (0.36)
        // Minus the 6000 because these minutes have already been calculated

    } else if (ageInMins >= 15000) {
        //Tree is > 10 days old.
        //Increment even slower per min. (+0.01 per day)
        //After approx. 10 days it will reach 0.7
        growth = (ageInMins - 15000) * 0.000006 + 0.63
        // Growth is now calculated from the total summed growth so far (0.36)
        // Minus the 6000 because these minutes have already been calculated

    }
    if(growth >= 0.7) growth = 0.7
    return Number(growth.toFixed(4))

}

async function updateTreeAge(tree){
    const update = "scale";
    const value = calculateGrowth(tree.dateplanted, getDate());
    await updateTreeById(tree.id, update, value)
}

router.use("/:id", async function(req,res,next){

    const payload = await getTreeById(req.params.id)
    await updateTreeAge(payload[0])
    next();
})


// GET all trees
router.get("/", async (req, res) => {
    //Query Handler???
    if (req.query.search) {
        if (req.query.search.match(/^\d+$/)) {
            const query = Number(req.query.search);
            const payload = await getTreeById(query)
            res.json({
                success: true,
                message: `Retrieved tree with id ${query}`,
                payload: payload,
                serverTime: getDate()
            })
            return
        }
        const query = req.query.search.toLowerCase();
        const payload = await getTreesByName(query)
        res.json({
            success: true,
            message: `Retrieved trees with name ${query}`,
            payload: payload,
            serverTime: getDate()
        })
        return
    }

    //Function to get all trees
    const payload = await getTrees();
    res.json({
        success: true,
        message: `Retrieved all trees`,
        payload: payload,
        serverTime: getDate()
    });
});

router.get("/:id", async (req, res) => {
    //Function to get tree by ID
    const payload = await getTreeById(req.params.id)
    res.json({
        success: true,
        message: `Retrieved tree with id ${req.params.id}`,
        payload: payload,
        serverTime: getDate()
    })
})

router.post("/", async (req, res) => {
    // Function to create new tree
    const tree = req.body;
    const payload = await createTree(tree);
    res.redirect("/")
    console.log({
        success: true,
        message: "Successfully created new tree..",
        payload: payload,
        serverTime: getDate()
    })
})

router.put("/:id", async (req, res) => {
    // function to replace tree
    const payload = await replaceTreeById(req.params.id)
    res.json({
        success: true,
        message: `Replaced tree at id ${req.params.id}`,
        payload: payload,
        serverTime: getDate()
    })
})

router.patch("/:id", async (req, res) => {
  
    const update = req.body.update;
    let value = req.body.value;
    const payload = await updateTreeById(req.params.id, update, value)
    // function to update tree
    res.json({
        success: true,
        message: `Updated tree at id ${req.params.id}, changed ${update} to ${value}`,
        payload: payload,
        serverTime: getDate()
    })
})




router.delete("/:id", async (req, res) => {

    const checkPass = await checkPassword(req.params.id, req.body.password)
    if (!checkPass) {
        res.json({
            success: false,
            message: `Incorrect Password!`
        })
        return
    }
    //function to delete tree by id
    const payload = await deleteTreeById(req.params.id)
    res.json({
        success: true,
        message: `Deleted tree at id ${req.params.id}`,
        payload: payload,
        serverTime: getDate()
    })
})

async function checkPassword(id, password) {

    const payload = await getTreeById(id)
    const hash = payload[0].password
    const passwordCheck = await bcrypt.compareSync(password, hash);
    return passwordCheck;
}







export default router;