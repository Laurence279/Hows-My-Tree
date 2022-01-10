import {
    query, close
} from "../../db/db.js"

const sqlString = "SELECT * FROM trees01"

async function selectAllTrees() {
    const response = await query(sqlString)
    await close();
    return response.rows;
}

selectAllTrees();