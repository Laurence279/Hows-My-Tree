// API routing information


import express from "express";
const router = express.Router();


import {
    getTrees,
    getTreeById,
    getTreesByName,
    createTree,
    updateTreeById,
    replaceTreeById,
    deleteTreeById
} from "../models/trees.js"

function getDate() {
    return new Date();
}

// GET all trees
router.get("/", async (req, res) => {

    //Query Handler???
    if (req.query.name) {
        const payload = await getTreesByName(req.query.name)
        res.json({
            success: true,
            message: `Retrieved trees with name ${req.query.name}`,
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
    res.json({
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
    console.log(req.body)
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

    //function to delete tree by id
    const payload = await deleteTreeById(req.params.id)
    res.json({
        success: true,
        message: `Deleted tree at id ${req.params.id}`,
        payload: payload,
        serverTime: getDate()
    })
})





export default router;