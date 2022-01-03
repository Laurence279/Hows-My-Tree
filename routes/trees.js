// API routing information


import express from "express";
const router = express.Router();
import bcrypt from "bcrypt"
const saltRounds = 10;


import {
    getTrees,
    getTreeById,
    createTree,
    updateTreeById,
    replaceTreeById,
    deleteTreeById,
    getTreesByName
} from "../models/trees.js"

function getDate() {
    return new Date();
}



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
    console.log(payload)
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
    const value = req.body.value;
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