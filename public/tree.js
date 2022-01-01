;
(async function getTreeById() {
    const id = window.location.href.split("/").pop();
    const response = await fetch(`/trees/${id}`);
    const data = await response.json();
    serverTime = data.serverTime;
    treeDisplay.appendChild(displayTree(data.payload[0]))
    updateTreeDetails(data.payload[0]);
})();

var serverTime;


// Cache

const treeDisplay = document.querySelector("#user-tree-display")
const deleteOverlay = document.querySelector("#delete-overlay")
const treeDetailsOwner = document.querySelector("#tree-details-owner")
const treeDetailsDatePlanted = document.querySelector("#tree-details-date-planted");
const treeDetailsLabel = document.querySelector("#tree-details-label");
const waterBtn = document.querySelector("#water-btn")

waterBtn.addEventListener("click", (e) => {
    makePatchRequest();
})

async function makePatchRequest() {
    const id = window.location.href.split("/").pop();
    const response = await fetch(`/trees/${id}`, {
        method: `PATCH`,
        body: JSON.stringify({
            update: 'datewatered',
            value: new Date().toDateString()
        }),
        headers: {
            'content-type': 'application/json'
        }
    });
    console.log(await response.json())
}

function displayTree(object) {
    const tree = document.createElement("img");

    // for (let key in object) {
    //     const text = document.createElement("p")
    //     text.textContent = `${[key]}: ${object[key]}`;
    //     tree.appendChild(text)
    // }

    // Get the difference between today and date planted in days
    let daysSincePlanted = (Math.floor(Math.abs(new Date(serverTime) - new Date(object.dateplanted)) / 86400000))
    if (daysSincePlanted >= 9) {
        daysSincePlanted = 9
    }
    tree.src = `images/${1+daysSincePlanted}.png`
    tree.alt = "tree"
    return tree
}

function updateTreeDetails(data) {
    treeDetailsOwner.textContent = `${data.ownertitle} ${data.ownerfirstname} ${data.ownerlastname}`
    treeDetailsDatePlanted.textContent = `Date Planted: ${new Date(data.dateplanted.split("T")[0]).toDateString()}`;
    treeDetailsLabel.textContent = data.label;
}