;
(async function getTreeById() {
    const id = window.location.href.split("/").pop();
    const response = await fetch(`/trees/${id}`);
    const data = await response.json();
    treeDisplay.appendChild(createNewTree(data.payload[0]))
})();


// Cache

const treeDisplay = document.querySelector("#user-tree-display")
const deleteOverlay = document.querySelector("#delete-overlay")


function createNewTree(object) {
    const tree = document.createElement("div");
    for (let key in object) {
        const text = document.createElement("p")
        text.textContent = `${[key]}: ${object[key]}`;
        tree.appendChild(text)
    }
    return tree
}