/*eslint-env browser */
// Set Up Variables
var canvas;
var context;
var WIDTH = 600;
var HEIGHT = 400;

// Set Up Functions
function init (){
    // Get reference to canvas
    canvas = document.getElementById("myCanvas");
    context = canvas.getContext('2d');
    
    //Draw player
context.fillStyle="#EB9DE9";
context.fillRect(0,0,25,50);
}

//Call the init function as soon as the page has finished loading
window.onload = init;