
;
(async function getTreeById() {
    const id = window.location.href.split("/").pop();
    const isNum = /^\d+$/.test(id);
    if(!isNum) {
        sendErrorPage()
        return;
    }
    const response = await fetch(`/trees/${id}`);
    const data = await response.json();
    if(data.payload.length <= 0){
        sendErrorPage();
        return;
    }
    responseData = data;
    treeData = responseData.payload[0]
    await initialiseTreeCanvas(treeData);
    if (new Date(treeData.datewatered).toDateString() == new Date(responseData.serverTime).toDateString()) {
        waterBtn.textContent= ("Already watered today!")
        waterBtn.disabled = true;
        waterBtn.classList.add("main-btn-disabled")
    }
    updateTreeDetails(treeData);
})();

function sendErrorPage(){

        document.querySelector("#wrap").innerHTML = "<h1>Tree Not Found!</h1>"
}

var responseData = {};
var treeData = {}


// Cache


const treeDisplay = document.querySelector("#user-tree-display")
const deleteOverlay = document.querySelector("#delete-overlay")
const treeDetailsOwner = document.querySelector("#tree-details-owner")
const treeDetailsDatePlanted = document.querySelector("#tree-details-date-planted");
const treeDetailsLabel = document.querySelector("#tree-details-label");
const treeId = document.querySelector("#tree-id")
const treeGrowth = document.querySelector("#tree-growth-stage")
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
        waterBtn.textContent= ("Already watered today!")
        waterBtn.disabled = true;
        waterBtn.classList.add("main-btn-disabled")
        return
    }
    e.preventDefault();
    console.log("Watering tree")
    await makePatchRequest("datewatered", "GET_DATE");
    await makePatchRequest("timeswatered", treeData.timeswatered += 1);
    waterBtn.textContent= ("Already watered today!")
    waterBtn.disabled = true;
    createRain();
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


function updateTreeDetails(data) {
    treeId.textContent = `${data.id}`;
    treeGrowth.textContent = displayIfFullyGrown(data.scale);
    treeDetailsOwner.textContent = `${data.ownertitle} ${data.ownerfirstname} ${data.ownerlastname}`
    treeDetailsDatePlanted.textContent = `Planted: ${new Date(data.dateplanted.split("T")[0]).toLocaleDateString('en-us',{
        year:"numeric",
        month:"short",
        day:"numeric"
    })}`;
    treeDetailsLabel.textContent = data.label;
}

function displayIfFullyGrown(scale){
    return scale === 0.7 ? "Fully Grown" : "";
}


//Watering Tree.

//Number of raindrops to instantiate
const numRaindrops = 200;

const rainContainer = document.querySelector("#rain-container");

//Generate random number for spawn position
function randRange( minNum, maxNum) {
    return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
  }

//Function to loop through and create drops
let i = 0;
function createRain(){
        const rainDropPosX = randRange(-500,-10);
        const rainDropPosY = randRange(-500,-10);
        rainContainer.append(createRainDrop(rainDropPosX, rainDropPosY));
        i++;
        if(i <= numRaindrops){
            setTimeout(createRain, 5)
        }
    }


//Initialise rain


function createRainDrop(posX, posY){
    const rainDrop = document.createElement("div");
    rainDrop.classList.add("rain-drop");
    rainDrop.style.left = `${posX}px`;
    rainDrop.style.top = `${posY}px`;
    return rainDrop;
}





//Canvas


var height = 500;
var width = 600;


// Generate the seed's array on client side here:
let index = 0;

function generateBranches(seed) {


    const nums = Array.from({
        length: 100000
    }, () => (simple_random()));

    function simple_random(precision = 10000) {
        x = Math.sin(seed++) * precision;
        return x - Math.floor(x);
    }

    return nums;
}

let nums;

//Create the tree!
function drawTree(treeData) {

    // Store data from database object here

    nums = generateBranches(treeData.seed)


    const scale = treeData.scale; //0 - 0.7 - Growth stage - Increases over time.
    const maxBranchWidth = treeData.branchwidth
    const colour = treeData.colour; // Allow user to choose
    const branchColour = treeData.branchcolour;
    const leaves = treeData.leaves; // Allow user to choose



    switch (leaves) {
        case 'small':
            leafType = tree.SMALL_LEAVES;
            break;
        case 'medium':
            leafType = tree.MEDIUM_LEAVES;
            break;
        case 'big':
            leafType = tree.BIG_LEAVES;
            break;
        case 'thin':
            leafType = tree.THIN_LEAVES;
            break;
        default:
            leafType = tree.MEDIUM_LEAVES;
    }
    const treeSpread = 0.6;
    const drawLeaves = true;
    const lengthFactor = 200;



    ctx.save();
    tree.draw(ctx, height, width, treeSpread, drawLeaves, leafType, lengthFactor, maxBranchWidth,
        colour, branchColour, scale);
    ctx.restore();
}



function initialiseTreeCanvas(treeData, canvas) {



    var canvas = document.querySelector("canvas")

    if (canvas.getContext("2d")) {

        // document.getElementById("saveImage").onclick = function () {
        //     window.location = canvas.toDataURL("image/png");
        // }

        canvas.height = height;
        canvas.width = width;
        ctx = canvas.getContext("2d");
        drawTree(treeData);

    } else {
        canvas.innerHTML = "Your browser doen't support Canvas!";
    }
};

var tree = {


    canvas: '',
    ctx: '',
    height: 0,
    width: 0,
    drawLeaves: true,
    leavesColor: '',
    branchColour: '',
    leafType: this.MEDIUM_LEAVES,
    lengthFactor: 200,
    maxBranchWidth: 10,
    SMALL_LEAVES: 10,
    MEDIUM_LEAVES: 200,
    BIG_LEAVES: 500,
    THIN_LEAVES: 750,

    /**
     * @member draw
     * tree.draw() initializes tthe tree structure
     *
     * @param {object} ctx      the canvas context
     * @param {integer} h       height of the canvas
     * @param {integer} w       width of the canvas
     * @param {float} spread    how much the tree branches are spread
     *                          Ranges from 0.3 - 1.
     * @param {boolean} leaves  draw leaves if set to true    
     *
     */
    draw: function (ctx, h, w, spread, leaves, leafType, lengthFactor, maxBranchWidth, colour, branchColour,
        scale) {




        this.scale = scale





        // Set how much the tree branches are spread
        if (spread >= 0.3 && spread <= 1) {
            this.spread = spread;
        }

        if (leaves === true || leaves === false) {
            this.drawLeaves = leaves;
        }

        this.leafType = leafType;



        if (lengthFactor >= 5 && lengthFactor <= 500) {
            this.lengthFactor = lengthFactor
        }

        if (maxBranchWidth >= 1 && maxBranchWidth <= 50) {
            this.maxBranchWidth = maxBranchWidth
        }

        this.ctx = ctx;
        this.height = h;
        this.width = w;
        this.ctx.clearRect(0, 0, this.width, this.height);
        // Center the tree in the window
        this.ctx.translate(this.width / 2, this.height);
        // Set the leaves to a random color
        this.leavesColor = colour;
        // Set branch thickness and colour
        this.branchColour = branchColour;
        this.ctx.lineWidth = 1 + (1 * this.maxBranchWidth); // Was Random number 
        this.ctx.lineJoin = 'round';

        this.branch(0);
    },

    /**
     * @member branch
     * tree.branch() main tree drawing function
     *
     * @param {String} depth the maimum depth the tree can branch,
     *        Keep this value near 12, larger value take linger to render.
     *
     */


    branch: function (depth) {


        if (depth < 13) {

            index += 1


            this.ctx.strokeStyle = this.branchColour;
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(0, -(this.height / 10));
            this.ctx.stroke();

            this.ctx.translate(0, -(this.height) / 10);


            // Random integer from -0.1 to 0.1
            var randomN = -(nums[index] * 0.2) + 0.1; // SETS THE TREE SWAY
            //var randomN = 0;
            this.ctx.rotate(randomN);

            if (nums[index] < this.spread) {

                // If num is less than the spread (0.7 default), then create a branch,
                // Increment the depth, and run the branch function again.
                // Otherwise, run the function again and check the number without incrementing

                //So the higher the spread, the more branches will be made because it will check
                //More often


                // Draw the left branches
                this.ctx.rotate(-0.3);
                this.ctx.scale(this.scale, this.scale);
                this.ctx.save();
                this.branch(depth + 1);
                // Draw the right branches
                this.ctx.restore();
                this.ctx.rotate(0.6);
                this.ctx.save();
                this.branch(depth + 1);
                this.ctx.restore();

            } else {

                this.branch(depth);
            }

        } else {

            // Now that we have done drawing branches, draw the leaves
            if (this.drawLeaves) {
                var lengthFactor = this.lengthFactor;

                if (this.leafType === this.THIN_LEAVES) {
                    lengthFactor = 30;
                }
                this.ctx.fillStyle = this.leavesColor;

                this.ctx.fillRect(0, 0, this.leafType, lengthFactor);
                this.ctx.stroke();
            }
        }

    }
};





/*
        
                    Algorithmic Tree - 1.0.0
                    drawing trees algorithmically on the HTML5 canvas
        
                    License       : GPL
                    Developer     : Sameer Borate: http://codediesel.com
                    Web Site      : http://codediesel.com
        
                 */

//#endregion