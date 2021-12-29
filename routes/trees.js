// API routing information


import express from "express";
const router = express.Router();


// import {
//   getAllBooks,
//   getBookById,
//   getBooksByTitle
// } from "../models/books.js";



// GET all trees
router.get("/", async (req, res) => {

    res.json({
        success: true,
        message: `IT WORKS`
    });
});




export default router;