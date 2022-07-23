/*eslint-env browser */
// Set Up Variables
var canvas;
var context;
var WIDTH = 600;
var HEIGHT = 400;
var player = new Sprite();
var score = 0;
var message = "Score: " + score;


// Set Up Functions
function init (){
    // Get reference to canvas
    canvas = document.getElementById("myCanvas");
    context = canvas.getContext('2d');
    
//Call the update function every 10 milliseconds
setInterval(update, 10);


//Call the function movePlayer when the mouse moves
canvas.onmousemove = movePlayer;
}
    function update() {
    	
    //Clear canvas of shapes
    //Potatoes
    clear();
    
    ///Draw player
context.fillStyle='#eb9de9';
context.fillRect(player.x, player.y, player.width, player.height);
    
    
    //Score text font and color
context.font = "25px impact";
context.fillStyle = "#000000";

//Display score
message = "Score: " + score;
context.fillText(message, 50, 50);
}




    function clear() {
 context.clearRect(0, 0, WIDTH, HEIGHT);
}

function Sprite() {
    this.x = 0;
    this.y = 0;
    this.width = 25;
    this.height = 50;
    this.isVisible = true;
}


function movePlayer(event) {
    player.x = event.pageX - canvas.offsetLeft;
    player.y = event.pageY - canvas.offsetTop;
}

//Call the init function as soon as the page has finished loading
window.onload = init;
