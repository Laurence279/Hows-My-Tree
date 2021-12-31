;
(async function getTrees() {
    const response = await fetch("/trees");
    const data = await response.json();
    populateTrees(data.payload)
})();


// Cache



const displayGrid = document.querySelector("#tree-display-grid")


function createNewTree(object) {

    const tree = document.createElement("a")
    tree.href = `/${object.id}`
    const treeContent = document.createElement("div");
    treeContent.classList.add("tree-container")
    for (let key in object) {
        const text = document.createElement("p")
        text.textContent = `${[key]}: ${object[key]}`;
        treeContent.appendChild(text)
    }
    tree.appendChild(treeContent)
    return tree
}

function populateTrees(data) {
    for (let i = 0; i < data.length; i++) {
        const tree = createNewTree(data[i])
        displayGrid.appendChild(tree)
    }
}