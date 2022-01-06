import {
    query
} from "../db.js"

const sqlString = "CREATE TABLE IF NOT EXISTS trees01(id SERIAL PRIMARY KEY,datePlanted TIMESTAMP, dateWatered TIMESTAMP, ownerTitle TEXT, ownerFirstName TEXT, ownerLastName TEXT, seed INTEGER, scale FLOAT, branchWidth INTEGER,leaves TEXT,colour TEXT, label TEXT, password TEXT);"




async function createTable() {
    const response = await query(sqlString)
    console.log("response", response)
}

createTable()