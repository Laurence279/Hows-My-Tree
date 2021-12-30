// API query functions..

import {
    query
} from "../db/db.js";

// Get all trees

export async function getTrees() {
    const response = await query("SELECT * FROM trees;")
    return response.rows
}

// Get tree by ID

export async function getTreeById(id) {
    const response = await query("SELECT * FROM trees WHERE id = $1;", [id])
    return response.rows;
}

// Get trees by owner name

export async function getTreesByName(name) {
    const response = await query("SELECT * FROM trees WHERE ownerFirstName = $1 OR ownerLastName = $1;", [name])
    return response.rows;
}

// Create tree 
export async function createTree(tree) {
    const {
        datePlanted,
        dateWatered,
        ownerTitle,
        ownerFirstName,
        ownerLastName,
        seed,
        colour,
        label,
        password
    } = tree
    const response = await query("INSERT INTO trees VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9;", [datePlanted, dateWatered, ownerTitle, ownerFirstName, ownerLastName, seed, colour, label, password])
    return response.rows;
}

// Patch tree by ID.

export async function updateTreeById(id, columnToUpdate, valueToUpdate) {
    const response = await query("UPDATE trees SET $1 = $2 WHERE id = $3;", [columnToUpdate, valueToUpdate, id])
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
        label,
        password
    } = tree
    const response = await query("UPDATE trees SET datePlanted = $1, dateWatered = $2, ownerTitle = $3, ownerFirstName = $4, ownerLastName = $5, seed = $6, colour = $7, label = $8, password = $9 WHERE id = $10;", [datePlanted, dateWatered, ownerTitle, ownerFirstName, ownerLastName, seed, colour, label, password, id])
    return response.rows;
}

// Delete tree by ID.

export async function deleteTreeById(id) {
    const response = await query("DELETE FROM trees WHERE id = $1", [id])
    return response;
}