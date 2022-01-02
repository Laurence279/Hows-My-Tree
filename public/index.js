async function updateTreeGrowthStage(object) {
    const oldGrowthStage = object.growthstage;

    // Get the difference between today and date planted in days
    const daysSincePlanted = (Math.floor(Math.abs(new Date(responseData.serverTime) - new Date(object.dateplanted)) / 86400000))
    let totalGrowth = oldGrowthStage + (daysSincePlanted * 10);
    if (totalGrowth >= 90) {
        totalGrowth = 90
    }
    const updatedGrowthStage = totalGrowth
    await makePatchRequest(object.id, "growthStage", updatedGrowthStage)
}

;
(async function getTrees() {
    const response = await fetch("/trees");
    const data = await response.json();
    responseData = data;
    treeData = data.payload;
    populateTrees(treeData)
})();

var responseData = {};
var treeData = {}


async function makePatchRequest(id, update, value) {
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
}


// Cache


const search = document.querySelector("#search")
const searchBtn = document.querySelector("#search-btn")
const displayGrid = document.querySelector("#tree-display-grid")

searchBtn.addEventListener("click", async (e) => {
    displayGrid.innerHTML = ""
    const response = await fetch(`/trees?search=${search.value}`);
    const data = await response.json();
    responseData = data;
    treeData = data.payload;
    populateTrees(treeData)
})

function createNewTree(object) {
    const tree = document.createElement("a")
    tree.href = `/${object.id}`
    const treeContent = document.createElement("div");
    treeContent.classList.add("tree-container")
    // for (let key in object) {
    //     const text = document.createElement("p")
    //     text.textContent = `${[key]}: ${object[key]}`;
    //     treeContent.appendChild(text)
    // }
    const img = document.createElement("img");
    // Get the difference between today and date planted in days
    let growthImage = object.growthstage / 10
    img.src = `images/${1+growthImage}.png`
    img.alt = "tree"

    const ownerDetails = document.createElement("h3");
    ownerDetails.textContent = `${object.ownertitle} ${object.ownerfirstname[0]}. ${object.ownerlastname}`
    const treeDetails = document.createElement("h4");
    treeDetails.textContent = `${object.label || "It's a tree!"}`
    treeContent.appendChild(ownerDetails)
    treeContent.appendChild(img)
    treeContent.appendChild(treeDetails)

    tree.appendChild(treeContent)
    return tree
}

async function populateTrees(data) {
    for (let i = 0; i < data.length; i++) {
        await updateTreeGrowthStage(data[i])
        const tree = createNewTree(data[i])
        displayGrid.appendChild(tree)
    }
}