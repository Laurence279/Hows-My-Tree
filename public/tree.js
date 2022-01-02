async function updateTreeGrowthStage() {
    const oldGrowthStage = treeData.growthstage;

    // Get the difference between today and date planted in days
    const daysSincePlanted = (Math.floor(Math.abs(new Date(responseData.serverTime) - new Date(treeData.dateplanted)) / 86400000))
    let totalGrowth = oldGrowthStage + (daysSincePlanted * 10);
    if (totalGrowth >= 90) {
        totalGrowth = 90
    }
    const updatedGrowthStage = totalGrowth
    await makePatchRequest("growthStage", updatedGrowthStage)
}


(async function getTreeById() {
    const id = window.location.href.split("/").pop();
    const response = await fetch(`/trees/${id}`);
    const data = await response.json();
    responseData = data;
    treeData = responseData.payload[0]
    await updateTreeGrowthStage();
    treeDisplay.appendChild(displayTree(treeData))
    updateTreeDetails(treeData);
})();

var responseData = {};
var treeData = {}


// Cache

const treeDisplay = document.querySelector("#user-tree-display")
const deleteOverlay = document.querySelector("#delete-overlay")
const treeDetailsOwner = document.querySelector("#tree-details-owner")
const treeDetailsDatePlanted = document.querySelector("#tree-details-date-planted");
const treeDetailsLabel = document.querySelector("#tree-details-label");
const waterBtn = document.querySelector("#water-btn")

waterBtn.addEventListener("click", async (e) => {
    if (new Date(treeData.datewatered).toDateString() == new Date(responseData.serverTime).toDateString()) {
        console.log("Already watered today!")
        return
    }
    await makePatchRequest("datewatered", new Date().toDateString());
    await makePatchRequest("growthStage", treeData.growthstage += 10);
    window.location.reload();
})

async function makePatchRequest(update, value) {
    const id = window.location.href.split("/").pop();
    const response = await fetch(`/trees/${id}`, {
        method: `PATCH`,
        body: JSON.stringify({
            update: `${update}`,
            value: `${value}`
        }),
        headers: {
            'content-type': 'application/json'
        }
    });
    console.log(response)
}

function displayTree(object) {
    const tree = document.createElement("img");

    // for (let key in object) {
    //     const text = document.createElement("p")
    //     text.textContent = `${[key]}: ${object[key]}`;
    //     tree.appendChild(text)
    // }
    let growthImage = object.growthstage / 10

    tree.src = `images/${1+growthImage}.png`
    tree.alt = "tree"
    return tree
}

function updateTreeDetails(data) {
    treeDetailsOwner.textContent = `${data.ownertitle} ${data.ownerfirstname} ${data.ownerlastname}`
    treeDetailsDatePlanted.textContent = `Planted: ${new Date(data.dateplanted.split("T")[0]).toDateString()}`;
    treeDetailsLabel.textContent = data.label;
}