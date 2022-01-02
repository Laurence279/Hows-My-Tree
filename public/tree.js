;
(async function getTreeById() {
    const id = window.location.href.split("/").pop();
    const response = await fetch(`/trees/${id}`);
    const data = await response.json();
    responseData = data;
    treeData = responseData.payload[0]
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

waterBtn.addEventListener("click", (e) => {
    if (new Date(treeData.datewatered).toDateString() == new Date(responseData.serverTime).toDateString()) {
        console.log("Already watered today!")
        return
    }
    makePatchRequest("datewatered", new Date().toDateString());
    makePatchRequest("growthStage", treeData.growthstage += 10)
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

    // Get the difference between today and date planted in days
    const daysSincePlanted = (Math.floor(Math.abs(new Date(responseData.serverTime) - new Date(object.dateplanted)) / 86400000))
    let totalGrowth = ((daysSincePlanted * 10) + (treeData.growthstage)) / 10;
    if (totalGrowth >= 9) {
        totalGrowth = 9
    }

    tree.src = `images/${1+totalGrowth}.png`
    tree.alt = "tree"
    return tree
}

function updateTreeDetails(data) {
    treeDetailsOwner.textContent = `${data.ownertitle} ${data.ownerfirstname} ${data.ownerlastname}`
    treeDetailsDatePlanted.textContent = `Date Planted: ${new Date(data.dateplanted.split("T")[0]).toDateString()}`;
    treeDetailsLabel.textContent = data.label;
}