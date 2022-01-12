// API query functions..

import {
    query
} from "../db/db.js";
import bcrypt from "bcrypt"
const saltRounds = 10;




// Get all trees

export async function getTrees() {
    const response = await query("SELECT * FROM trees01;")
    return response.rows
}

// Get tree by ID

export async function getTreeById(id) {
    id = Number(id);
    const isNum = /^\d+$/.test(id);
    if(!isNum) {
        return;
    }
    const response = await query("SELECT * FROM trees01 WHERE id = $1;", [id])
    return response.rows;
}

// Get trees by owner name

export async function getTreesByName(name) {
    if (typeof (name) != "string") return
    var param = name.toLowerCase()
    const response = await query("SELECT * FROM trees01 WHERE LOWER(ownerfirstname || ownerlastname) LIKE ('%' || Lower($1) || '%');", [param])
    return response.rows;
}

// Create tree 
export async function createTree(tree) {

    //Generate seed
    const seed = Math.ceil(Math.random() * 1000000)

        //Generate thickness
    const thicknessSize = {
        stick: {
            min: 1,
            max: 2
        },
        thin: {
            min: 3,
            max: 5
        },
        normal: {
            min: 6,
            max: 15
        },
        thick: {
            min: 16,
            max: 22
        },
        chonk: {
            min: 23,
            max: 30
        }
    }
    const branchWidth = Math.floor(Math.random() * (thicknessSize[tree.thickness].max - thicknessSize[tree.thickness].min + 1) + thicknessSize[tree.thickness].min)
    // Hash password
    const password = bcrypt.hashSync(tree.password, saltRounds);
    //Create timestamp
    const date = new Date();
    const datePlanted = date;
    const dateWatered = new Date("2000");
    const timesWatered = 0;
    const scale = 0.1;
    const {
        ownerTitle,
        ownerFirstName,
        ownerLastName,
        leaves,
        colour,
        branchColour,
        label
    } = tree;
     const response = await query("INSERT INTO trees01 (datePlanted, dateWatered, timesWatered, ownerTitle, ownerFirstName, ownerLastName, seed, scale, branchwidth, leaves, colour, branchcolour, label, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *;", [datePlanted, dateWatered, timesWatered, ownerTitle, ownerFirstName, ownerLastName, seed, scale, branchWidth, leaves, colour, branchColour, label, password])
     return response.rows;
}

// Patch tree by ID.

export async function updateTreeById(id, columnToUpdate, valueToUpdate) {

    if (columnToUpdate == "datewatered") {
        valueToUpdate = new Date();
        const response = await query(`UPDATE trees01 SET ${columnToUpdate} = $1 WHERE id = $2 RETURNING *;`, [valueToUpdate, id])
        return response.rows;
    }
    const response = await query(`UPDATE trees01 SET ${columnToUpdate} = $1 WHERE id = $2 RETURNING *;`, [valueToUpdate, id])
    return response.rows;
}

// Replace tree by ID.

export async function replaceTreeById(id, tree) {
    const {
        datePlanted,
        dateWatered,
        ownerTitle,
        ownerFirstName,
        ownerLastName,
        seed,
        colour,
        branchColour,
        label,
        password
    } = tree
    const response = await query("UPDATE trees01 SET datePlanted = $1, dateWatered = $2, ownerTitle = $3, ownerFirstName = $4, ownerLastName = $5, seed = $6, colour = $7, branchcolour = $8 label = $9, password = $10 WHERE id = $11;", [datePlanted, dateWatered, ownerTitle, ownerFirstName, ownerLastName, seed, colour, branchColour, label, password, id])
    return response.rows;
}

// Delete tree by ID.

export async function deleteTreeById(id) {

    const response = await query("DELETE FROM trees01 WHERE id = $1 RETURNING *;", [id])
    return response.rows;
}