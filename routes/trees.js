// API routing information


import express from "express";
import trees from "../exampleTreeData";
const router = express.Router();


// import {
//   getAllBooks,
//   getBookById,
//   getBooksByTitle
// } from "../models/books.js";



// GET all trees
router.get("/", async (req, res) => {

    //Query Handler???

    //Function to get all trees
    res.json({
        success: true,
        message: `Retrieved all trees`
    });
});

router.get("/:id", async (req, res) => {
    //Function to get tree by ID
    res.json({
        success: true,
        message: `Retrieved tree with id ${req.params.id}`
    })
})

router.post("/", async (req, res) => {
    // Function to create new tree
    res.json({
        success: trees,
        message: "Successfully created new tree.."
    })
})

router.put("/:id", async (req, res) => {
    // function to replace tree
    res.json({
        success: true,
        message: `Replaced tree at id ${req.params.id}`
    })
})

router.patch("/:id", async (req, res) => {
    const query = req.query;
    // function to update tree
    res.json({
        success: true,
        message: `Updated tree at id ${req.params.id}`
    })
})

router.delete("/:id", async (req, res) => {
    //function to delete tree by id
    res.json({
        success: true,
        message: `Deleted tree at id ${req.params.id}`
    })
})





export default router;