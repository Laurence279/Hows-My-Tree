import {
    query
} from "../../db/db.js"
import { DateTime, Interval } from "luxon";

function getDate() {
    return DateTime.now();
}

async function selectAllTrees() {
    const response = await query("SELECT * FROM trees01")
    return response.rows
}


function calculateGrowth(dateCreated, timesWatered, currentTime) {

    const ageInMins = Math.floor(Interval.fromDateTimes(dateCreated, currentTime).length('minutes'))


    let growth;

    if (ageInMins < 6000) {
        //Tree is < 4 days old.
        //Increment faster per min. (+0.1 per day)
        //After 4 days it will reach 0.3
        growth = (ageInMins * 0.00006);

    
    } else if (ageInMins < 15000) {
        //Tree is between 4 - 10 days old.
        //Increment slower per min. (+0.05 per day)
        //After 6 days it will reach 0.6
        growth = (ageInMins - 6000) * 0.00003 + 0.36;

        // Growth is now calculated from the total summed growth so far (0.36)
        // Minus the 6000 because these minutes have already been calculated

    } else if (ageInMins >= 15000) {
        //Tree is > 10 days old.
        //Increment even slower per min. (+0.01 per day)
        //After approx. 10 days it will reach 0.7
        growth = (ageInMins - 15000) * 0.000006 + 0.63;

        // Growth is now calculated from the total summed growth so far (0.63)
        // Minus the 15000 because these minutes have already been calculated

    }

    const waterBoost = (growth / 100) * 1 * timesWatered; // +1% per day of watering
    growth += waterBoost; //Total growth as scale
    if(growth >= 0.7) growth = 0.7
    return Number(growth.toFixed(4))

}

async function updateTreeAge(tree){
    const update = "scale";
    const value = calculateGrowth(tree.dateplanted, tree.timeswatered, getDate());
    await updateSqlRequest(tree.id, update, value)
}

async function updateSqlRequest(id, columnToUpdate, valueToUpdate) {
    console.log(`Updating Tree ${id}...`)
    const response = await query(`UPDATE trees01 SET ${columnToUpdate} = $1 WHERE id = $2 RETURNING *;`, [valueToUpdate, id])
    return response.rows;
}

async function init(){
    const trees = await selectAllTrees();
    for (let i = 0; i < trees.length; i ++){
        await updateTreeAge(trees[i])

    }
    console.log("Updated Trees!")
}

init();