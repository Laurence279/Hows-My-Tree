import {
    query
} from "../db.js"

const sqlString = "CREATE TABLE IF NOT EXISTS trees (id SERIAL PRIMARY KEY, datePlanted DATE, dateWatered DATE, ownerTitle TEXT, ownerFirstName TEXT, ownerLastName TEXT, seed TEXT, colour TEXT, label TEXT, password TEXT);"

async function createTable() {
    const response = await query(sqlString)
    console.log("response", response)
}

createTable()