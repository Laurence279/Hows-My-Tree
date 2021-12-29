import {
    query
} from "../db.js"

const sqlString = "SELECT * FROM trees"

async function selectAllTrees() {
    const response = await query(sqlString)
    console.log(response.rows)
}
selectAllTrees()