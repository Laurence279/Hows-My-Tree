// async function updateTreeGrowthStage() {
//     const oldGrowthStage = treeData.growthstage;

//     // Get the difference between today and date planted in days
//     const daysSincePlanted = (Math.floor(Math.abs(new Date(responseData.serverTime) - new Date(treeData.dateplanted)) / 86400000))
//     let totalGrowth = oldGrowthStage + (daysSincePlanted * 10);
//     if (totalGrowth >= 90) {
//         totalGrowth = 90
//     }
//     await makePatchRequest("growthStage", totalGrowth)
// }


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
const treeId = document.querySelector("#tree-id")
const waterBtn = document.querySelector("#water-btn")
const deleteBtn = document.querySelector("#delete-btn")
const deleteBtnConfirm = document.querySelector("#delete-btn-confirm")
const deleteOverlayCloseBtn = document.querySelector("#delete-close-btn")
const deleteOverlayPasswordInput = document.querySelector("#password-input")
var deleteOverlayEnabled = false;

deleteBtn.addEventListener("click", (e) => {
    if (deleteOverlayEnabled) {
        deleteOverlay.style.display = "none";
        deleteOverlayEnabled = false;
    } else {
        deleteOverlay.style.display = "";
        deleteOverlayEnabled = true;
    }
})

deleteOverlayCloseBtn.addEventListener("click", (e) => {
    if (!deleteOverlayEnabled) return
    deleteOverlay.style.display = "none";
    deleteOverlayEnabled = false;
})

deleteBtnConfirm.addEventListener("click", async (e) => {
    if (!deleteOverlayEnabled) return
    const id = window.location.href.split("/").pop();
    const password = deleteOverlayPasswordInput.value
    const response = await fetch(`/trees/${id}`, {
        method: `DELETE`,
        body: JSON.stringify({
            password: password
        }),
        headers: {
            'content-type': 'application/json'
        }
    });
    const data = await response.json();
    const correctPassword = data.success
    if (!correctPassword) return
    window.location.href = "/";

})

waterBtn.addEventListener("click", async (e) => {
    if (new Date(treeData.datewatered).toDateString() == new Date(responseData.serverTime).toDateString()) {
        console.log("Already watered today!")
        return
    }
    await makePatchRequest("datewatered", new Date().toDateString());
    await makePatchRequest("growthStage", treeData.growthstage += 1);
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
    const daysSincePlanted = (Math.floor(Math.abs(new Date(responseData.serverTime) - new Date(object.dateplanted)) / 86400000))
    let totalGrowth = object.growthstage + (daysSincePlanted);
    if (totalGrowth >= 9) {
        totalGrowth = 9
    }
    tree.src = `images/${1+totalGrowth}.png`
    tree.alt = "tree"
    return tree
}

function updateTreeDetails(data) {
    treeId.textContent = `${data.id}`;
    treeDetailsOwner.textContent = `${data.ownertitle} ${data.ownerfirstname} ${data.ownerlastname}`
    treeDetailsDatePlanted.textContent = `Planted: ${new Date(data.dateplanted.split("T")[0]).toLocaleDateString('en-us',{
        year:"numeric",
        month:"short",
        day:"numeric"
    })}`;
    treeDetailsLabel.textContent = data.label;
}