import {
    query
} from "../db.js"

const sqlString = "DELETE FROM trees"

async function deleteTrees() {
    const response = await query(sqlString)
    console.log(response)
}
deleteTrees()