;
(async function getTreeById() {
    const id = window.location.href.split("/").pop();
    const response = await fetch(`/trees/${id}`);
    const data = await response.json();
    responseData = data;
    treeData = responseData.payload
    populateTrees(treeData)
})();

var responseData = {};
var treeData = {}

// Cache



const displayGrid = document.querySelector("#tree-display-grid")


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
    const daysSincePlanted = (Math.floor(Math.abs(new Date(responseData.serverTime) - new Date(object.dateplanted)) / 86400000))
    let totalGrowth = ((daysSincePlanted * 10) + (object.growthstage)) / 10;
    if (totalGrowth >= 9) {
        totalGrowth = 9
    }
    img.src = `images/${1+totalGrowth}.png`
    img.alt = "tree"
    treeContent.appendChild(img)
    tree.appendChild(treeContent)
    return tree
}

function populateTrees(data) {
    for (let i = 0; i < data.length; i++) {
        const tree = createNewTree(data[i])
        displayGrid.appendChild(tree)
    }
}