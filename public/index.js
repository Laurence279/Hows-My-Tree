;
(async function getTrees() {
    const response = await fetch("/trees");
    const data = await response.json();
    serverTime = data.serverTime;
    populateTrees(data.payload)
})();

var serverTime;

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
    let daysSincePlanted = (Math.floor(Math.abs(new Date(serverTime) - new Date(object.dateplanted)) / 86400000))
    if (daysSincePlanted >= 9) {
        daysSincePlanted = 9
    }
    const growthStage = object.growthStage;
    console.log(growthStage)
    img.src = `images/${1+daysSincePlanted}.png`
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