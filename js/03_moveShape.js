/*eslint-env browser */
// Set Up Variables
var canvas;
var context;
var WIDTH = 600;
var HEIGHT = 400;
var x = 0;
var y = 0;

// Set Up Functions
function init (){
    // Get reference to canvas
    canvas = document.getElementById("myCanvas");
    context = canvas.getContext('2d');
    
    //Call the update function every 10 milliseconds
setInterval(update, 10);
}

    function update() {
    	
    //Clear canvas of shapes
    //Potatoes
    clear();
    
    //Increase x coordinate by 1
    x = x + 1;
    
    //Draw player
    context.fillStyle='#eb9de9';
    context.fillRect(x,y,25,50);
}

    function clear() {
 context.clearRect(0, 0, WIDTH, HEIGHT);
}

//Call the init function as soon as the page has finished loading
window.onload = init;