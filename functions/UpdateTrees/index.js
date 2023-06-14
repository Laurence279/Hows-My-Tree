const { createPool, query, close } = require("./db");
const { DateTime, Interval } = require("luxon");

module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString();
    const pool = createPool();
    
    if (myTimer.isPastDue)
    {
        context.log('JavaScript is running late!');
    }

    function getDate() {
        return DateTime.now();
    }
    
    async function getTrees() {
        const response = await query(pool, "SELECT * FROM trees01 WHERE scale < 0.7")
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
        return Math.min(Number(growth.toFixed(4)) + 0.1, 0.7);
    }
    
    async function updateTreeAge(tree){
        const update = "scale";
        const value = calculateGrowth(tree.dateplanted, tree.timeswatered, getDate());
        await updateSqlRequest(tree.id, update, value)
    }
    
    async function updateSqlRequest(id, columnToUpdate, valueToUpdate) {
        console.log(`Updating Tree ${id}...`)
        const response = await query(pool, `UPDATE trees01 SET ${columnToUpdate} = $1 WHERE id = $2 RETURNING *;`, [valueToUpdate, id])
        return response.rows;
    }
    
    async function init(){
        const trees = await getTrees();
        for (let i = 0; i < trees.length; i ++){
            await updateTreeAge(trees[i]);
        }
        console.log("Updated Trees!")
        await close(pool);
        console.log("Pool closed.")
    }
    
    init();

    context.log('JavaScript timer trigger function ran!', timeStamp);
};