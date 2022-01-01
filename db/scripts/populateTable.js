import {
    query
} from "../db.js"
import trees from "../../exampleTreeData.js"

const sqlString = "INSERT INTO trees (datePlanted, dateWatered, growrthState, ownerTitle, ownerFirstName, ownerLastName, seed, colour, label, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *"

async function populateTable() {
    for (let i = 0; i < trees.length; i++) {
        const datePlanted = trees[i].datePlanted
        const dateWatered = trees[i].dateWatered
        const ownerTitle = trees[i].ownerTitle
        const ownerFirstName = trees[i].ownerFirstName
        const ownerLastName = trees[i].ownerLastName
        const seed = trees[i].seed
        const colour = trees[i].colour
        const label = trees[i].label
        const password = trees[i].password
        const response = await query(sqlString, [datePlanted, dateWatered, ownerTitle, ownerFirstName, ownerLastName, seed, colour, label, password])
        console.log(response.rows)
    }
}
populateTable()