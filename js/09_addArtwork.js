//Add Artwork, Collectible Variables Loaded

/*eslint-env browser */
// Set Up Variables
var canvas;
var context;
var WIDTH = 600;
var HEIGHT = 400;
var player = new Sprite();
var score = 0;
var message = "Score: " + score;

// splash screen image settings
var splashScreenImage = new Image();
var splashScreenClicked = false;
splashScreenImage.src = "images/Game_Art/SplashPage.png";
// end splash screen image settings

//Variable for Player Image
var playerImage = new Image();
playerImage.src = "images/Game_Art/Player.png";
// end player image settings

// Fire Trap image settings
var FireTrap = new Image();
FireTrap.src = "images/Game_Art/Fire_Trap.png";

// Spike Trap image settings
var SpikeTrap = new Image();
SpikeTrap.src = "images/Game_Art/Spike_Trap.png";

// PitFall image settings
var PitFall = new Image();
PitFall.src = "images/Game_Art/Pitfall.png";

//Fire Spell Image Settings
var FireSpell = new Image();
FireSpell.src = "images/Game_Art/Fireball.png"

//Teleport Spell Image Settings
var TeleSpell = new Image();
TeleSpell.src = "images/Game_Art/Teleport.png"

//Water Spell Image Settings
var WaterSpell = new Image();
WaterSpell.src = "images/Game_Art/Water.png"

var firetraps = [];
for (var f = 0; f < 5; f++)   {
	firetraps.push(new Sprite());
    firetraps[f].x = Math.random() * 400;
    firetraps[f].y = Math.random() * 400;
    firetraps[f].width = 20;
    firetraps[f].height = 20;
}

var spiketraps = [];
for (var s = 0; s < 5; s++)   {
	spiketraps.push(new Sprite());
    spiketraps[s].x = Math.random() * 400;
    spiketraps[s].y = Math.random() * 400;
    spiketraps[s].width = 20;
    spiketraps[s].height = 20;
}

var pitfalls = [];
for (var p = 0; p < 5; p++)   {
	pitfalls.push(new Sprite());
    pitfalls[p].x = Math.random() * 400;
    pitfalls[p].y = Math.random() * 400;
    pitfalls[p].width = 20;
    pitfalls[p].height = 20;
}

var firespells = [];
for (var fs = 0; fs < 5; fs++)   {
	firespells.push(new Sprite());
    firespells[fs].x = Math.random() * 400;
    firespells[fs].y = Math.random() * 400;
    firespells[fs].width = 20;
    firespells[fs].height = 20;
}

var telespells = [];
for (var ts = 0; ts < 5; ts++)   {
	telespells.push(new Sprite());
    telespells[ts].x = Math.random() * 400;
    telespells[ts].y = Math.random() * 400;
    telespells[ts].width = 20;
    telespells[ts].height = 20;
}

var waterspells = [];
for (var ws = 0; ws < 5; ws++)   {
	waterspells.push(new Sprite());
    waterspells[ws].x = Math.random() * 400;
    waterspells[ws].y = Math.random() * 400;
    waterspells[ws].width = 20;
    waterspells[ws].height = 20;
}

// Set Up Functions
function init (){
    // Get reference to canvas
    canvas = document.getElementById("myCanvas");
    context = canvas.getContext('2d');
    
//Call the update function every 10 milliseconds
setInterval(update, 10);


//Call the function movePlayer when the mouse moves
canvas.onmousemove = movePlayer;

//Listen for player click on splash screen
canvas.onmousedown = canvasClicked; 
function canvasClicked(event) {
  splashScreenClicked = true;
}
}
    function update() {
    	//Draw splash screen
context.drawImage(splashScreenImage, 0, 0);
//Check if the user has clicked to start playing
if(splashScreenClicked){
    //Clear canvas of shapes
    //Potatoes
    clear();


//Draw Fireball
for (var f = 0; f < 5; f++) {
    var firetrap = firetraps[f];
    if (firetrap.isVisible == true) {
        context.drawImage(FireTrap, firetrap.x, firetrap.y);
    }
 
    //Check for collisions between the player and collectable. Also check if the collectable is visible
    if(firetrap.isVisible & collides(player, firetrap)){
        //If a collision occurs and the enemy is visible, decrease the score
	score --;
	//Change the enemy's visibility to false so that it only get picked up once
	firetrap.isVisible = false;
    }
    
}

//Draw Spiketrap
for (var s = 0; s < 5; s++) {
    var spiketrap = spiketraps[s];
    if (spiketrap.isVisible == true) {
        context.drawImage(SpikeTrap, spiketrap.x, spiketrap.y);
    }
 
    //Check for collisions between the player and collectable. Also check if the collectable is visible
    if(spiketrap.isVisible & collides(player, spiketrap)){
        //If a collision occurs and the enemy is visible, decrease the score
	score --;
	//Change the enemy's visibility to false so that it only get picked up once
	spiketrap.isVisible = false;
    }
}

//Draw Pitfall
for (var p = 0; p < 5; p++) {
    var pitfall = pitfalls[p];
    if (pitfall.isVisible == true) {
        context.drawImage(PitFall, pitfall.x, pitfall.y);
    }
 
    //Check for collisions between the player and collectable. Also check if the collectable is visible
    if(pitfall.isVisible & collides(player, pitfall)){
        //If a collision occurs and the enemy is visible, decrease the score
	score --;
	//Change the enemy's visibility to false so that it only get picked up once
	pitfall.isVisible = false;
    }
}
  
  //Draw Water Spell
for (var ws = 0; ws < 5; ws++) {
    var waterspell = waterspells[ws];
    if (waterspell.isVisible == true) {
        context.drawImage(WaterSpell, waterspell.x, waterspell.y);
    }
 
    //Check for collisions between the player and collectable. Also check if the collectable is visible
    if(waterspell.isVisible & collides(player, waterspell)){
        //If a collision occurs and the enemy is visible, decrease the score
	score ++;
	//Change the enemy's visibility to false so that it only get picked up once
	waterspell.isVisible = false;
    }
} 

//Draw Fire Spell
for (var fs = 0; fs < 5; fs++) {
    var firespell = firespells[fs];
    if (firespell.isVisible == true) {
        context.drawImage(FireSpell, firespell.x, firespell.y);
    }
 
    //Check for collisions between the player and collectable. Also check if the collectable is visible
    if(firespell.isVisible & collides(player, firespell)){
        //If a collision occurs and the enemy is visible, decrease the score
	score ++;
	//Change the enemy's visibility to false so that it only get picked up once
	firespell.isVisible = false;
    }
}

  //Draw Teleport Spell
for (var ts = 0; ts < 5; ts++) {
    var telespell = telespells[ts];
    if (telespell.isVisible == true) {
        context.drawImage(TeleSpell, telespell.x, telespell.y);
    }
 
    //Check for collisions between the player and collectable. Also check if the collectable is visible
    if(telespell.isVisible & collides(player, telespell)){
        //If a collision occurs and the enemy is visible, decrease the score
	score ++;
	//Change the enemy's visibility to false so that it only get picked up once
	telespell.isVisible = false;
    }
}

    //Draw player
context.drawImage(playerImage, player.x, player.y);
    
    
    //Score text font and color
context.font = "25px impact";
context.fillStyle = "#000000";

//Display score
 message = "Score: " + score;
 context.fillText(message, 0, 50);
 } //Closing curly brace for if(splashScreenClicked)
} //End update function



    function clear() {
 context.clearRect(0, 0, WIDTH, HEIGHT);
}

function Sprite() {
    this.x = 0;
    this.y = 0;
    this.width = 15;
    this.height = 15;
    this.isVisible = true;
}


function movePlayer(event) {
    player.x = event.pageX - canvas.offsetLeft;
    player.y = event.pageY - canvas.offsetTop;
}

//Call the init function as soon as the page has finished loading
window.onload = init;

//Check if object a and object b are colliding
function collides(a, b) {
   var val = false;
 
   val = (a.x < b.x + b.width) &&
   (a.x + a.width > b.x) &&
   (a.y < b.y + b.height) &&
   (a.y + a.height > b.y);
 
   return val;        
}
