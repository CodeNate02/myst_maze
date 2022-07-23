/*eslint-env browser */
// Set Up Variables
/*globals mazeWidth */
var canvas;
var context;
var WIDTH = 600;
var HEIGHT = 400;
var player = new Sprite();
player.x = 515;
player.y = 311;
var cursor = new Sprite();
var score = 0;
var message = "Score: " + score;

//Keyboard Control Variables
var isUpDown = false;
var isDownDown = false;
var isRightDown = false;
var isLeftDown = false;
var speed = 3;

//Maze Variables
var newY = 311;
var newX = 515;

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

// PitFall image settings
var backgroundImage = new Image();
backgroundImage.src = "images/Game_Art/Background2.png";

//Fire Spell Image Settings
var FireSpell = new Image();
FireSpell.src = "images/Game_Art/Fireball.png";

//Teleport Spell Image Settings
var TeleSpell = new Image();
TeleSpell.src = "images/Game_Art/Teleport.png";

//Water Spell Image Settings
var WaterSpell = new Image();
WaterSpell.src = "images/Game_Art/Water.png";

//Victory Image Settings
var Victory = new Image();
Victory.src = "images/Game_Art/Ladder.png";

//Sound variables
var collectableSound = new Audio('sounds/click.wav');



var victories = [];
for (var v = 0; v < 1; v++)   {
	victories.push(new Sprite());
    victories[v].x = 98;
    victories[v].y = 34;
    victories[v].width = 20;
    victories[v].height = 20;
}

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
    spiketraps[s].x = Math.random() *400;
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
    
	window.addEventListener('keydown',handleKeyDown,true);
window.addEventListener('keyup',handleKeyUp,true);
    
//Call the update function every 10 milliseconds
setInterval(update, 10);



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

//Draw background
context.drawImage(backgroundImage, 0, 0);

//Draw Victory Pickup
for (var v = 0; v < 1; v++) {
    var victory = victories[v];
    if (victory.isVisible == true) {
        context.drawImage(Victory, victory.x, victory.y);
    }
 
    //Check for collisions between the player and collectable. Also check if the collectable is visible
    if(victory.isVisible & collides(player, victory)){
        //If a collision occurs and the enemy is visible, decrease the score
	score ++;
	//Change the enemy's visibility to false so that it only get picked up once
	victory.isVisible = false;
	//End The Game
	window.open("00_winScreen.html", "_self");
    }
}

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
	//End The Game
	window.open("00_fireLoss.html", "_self");
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
	//Play the Loss Beep when the player hits the Spike Trap
	//Change the enemy's visibility to false so that it only get picked up once
	spiketrap.isVisible = false;
	
	window.open("00_spikeLoss.html", "_self");
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
	//Play the Loss Beep when the player hits the Pitfall
	//Change the enemy's visibility to false so that it only get picked up once
	pitfall.isVisible = false;
	window.open("00_pitfallLoss.html", "_self");
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
    	collectableSound.play();
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
    	collectableSound.play();
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
    	collectableSound.play();
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
 
 handleInput();
 
 } //Closing curly brace for if(splashScreenClicked)
} //End update function

function handleInput() {
	if(isUpDown){
		newY = player.y-speed;
	}
	if(isDownDown){
		newY = player.y + speed;
	}
	
	if(isLeftDown){
		newX = player.x - speed;
	}
	if(isRightDown){
		newX = player.x + speed;
}

	var imgData = context.getImageData(newX, newY, 1, 1);
var data = imgData.data;
var imgData2 = context.getImageData(newX, newY, 1, 1);
var data2 = imgData2.data;
var imgData3 = context.getImageData(newX, newY + 1, 1, 1);
var data3 = imgData3.data;
var imgData4 = context.getImageData(newX, newY + 2, 1, 1);
var data4 = imgData4.data;
var imgData5 = context.getImageData(newX, newY + 2, 1, 1);
var data5 = imgData5.data;
var imgData6 = context.getImageData(newX, newY + 3, 1, 1);
var data6 = imgData6.data;
var imgData7 = context.getImageData(newX, newY + 4, 1, 1);
var data7 = imgData7.data;
var imgData8 = context.getImageData(newX, newY + 5, 1, 1);
var data8 = imgData8.data;
var imgData9 = context.getImageData(newX, newY + 6, 1, 1);
var data9 = imgData9.data;
var imgData10 = context.getImageData(newX, newY + 7, 1, 1);
var data10 = imgData10.data;
var imgData11 = context.getImageData(newX, newY + 8, 1, 1);
var data11 = imgData11.data;
var imgData12 = context.getImageData(newX, newY + 9, 1, 1);
var data12 = imgData12.data;
var imgData13 = context.getImageData(newX, newY + 10, 1, 1);
var data13 = imgData13.data;
var imgData14 = context.getImageData(newX, newY + 11, 1, 1);
var data14 = imgData14.data;
var imgData15 = context.getImageData(newX, newY + 12, 1, 1);
var data15 = imgData15.data;
var imgData16 = context.getImageData(newX, newY + 13, 1, 1);
var data16 = imgData16.data;
var imgData17 = context.getImageData(newX, newY + 14, 1, 1);
var data17 = imgData17.data;
var imgData18 = context.getImageData(newX + 1, newY, 1, 1);
var data18 = imgData18.data;
var imgData19 = context.getImageData(newX + 2, newY, 1, 1);
var data19 = imgData19.data;
var imgData20 = context.getImageData(newX + 3, newY, 1, 1);
var data20 = imgData20.data;
var imgData21 = context.getImageData(newX + 4, newY, 1, 1);
var data21 = imgData21.data;
var imgData22 = context.getImageData(newX + 5, newY, 1, 1);
var data22 = imgData22.data;
var imgData23 = context.getImageData(newX + 6, newY, 1, 1);
var data23 = imgData23.data;
var imgData24 = context.getImageData(newX + 7, newY, 1, 1);
var data24 = imgData24.data;
var imgData25 = context.getImageData(newX + 8, newY, 1, 1);
var data25 = imgData25.data;
var imgData26 = context.getImageData(newX + 9, newY, 1, 1);
var data26 = imgData26.data;
var imgData27 = context.getImageData(newX + 10, newY, 1, 1);
var data27 = imgData27.data;
var imgData28 = context.getImageData(newX + 11, newY, 1, 1);
var data28 = imgData28.data;
var imgData29 = context.getImageData(newX + 12, newY, 1, 1);
var data29 = imgData29.data;
var imgData30 = context.getImageData(newX + 13, newY, 1, 1);
var data30 = imgData30.data;
var imgData31 = context.getImageData(newX + 14, newY, 1, 1);
var data31 = imgData31.data;
var imgData32 = context.getImageData(newX + 14, newY + 1, 1, 1);
var data32 = imgData32.data;
var imgData33 = context.getImageData(newX + 14, newY + 2, 1, 1);
var data33 = imgData33.data;
var imgData34 = context.getImageData(newX + 14, newY + 3, 1, 1);
var data34 = imgData34.data;
var imgData35 = context.getImageData(newX + 14, newY + 4, 1, 1);
var data35 = imgData35.data;
var imgData36 = context.getImageData(newX + 14, newY + 5, 1, 1);
var data36 = imgData36.data;
var imgData37 = context.getImageData(newX + 14, newY + 6, 1, 1);
var data37 = imgData37.data;
var imgData38 = context.getImageData(newX + 14, newY + 7, 1, 1);
var data38 = imgData38.data;
var imgData39 = context.getImageData(newX + 14, newY + 8, 1, 1);
var data39 = imgData39.data;
var imgData40 = context.getImageData(newX + 14, newY + 9, 1, 1);
var data40 = imgData40.data;
var imgData41 = context.getImageData(newX + 14, newY + 10, 1, 1);
var data41 = imgData41.data;
var imgData42 = context.getImageData(newX + 14, newY + 11, 1, 1);
var data42 = imgData42.data;
var imgData43 = context.getImageData(newX + 14, newY + 12, 1, 1);
var data43 = imgData43.data;
var imgData44 = context.getImageData(newX + 14, newY + 13, 1, 1);
var data44 = imgData44.data;
var imgData45 = context.getImageData(newX + 14, newY + 14, 1, 1);
var data45 = imgData45.data;
var imgData46 = context.getImageData(newX + 1, newY + 14, 1, 1);
var data46 = imgData46.data;
var imgData47 = context.getImageData(newX + 2, newY + 14, 1, 1);
var data47 = imgData47.data;
var imgData48 = context.getImageData(newX + 3, newY + 14, 1, 1);
var data48 = imgData48.data;
var imgData49 = context.getImageData(newX + 4, newY + 14, 1, 1);
var data49 = imgData49.data;
var imgData50 = context.getImageData(newX + 5, newY + 14, 1, 1);
var data50 = imgData50.data;
var imgData51 = context.getImageData(newX + 6, newY + 14, 1, 1);
var data51 = imgData51.data;
var imgData52 = context.getImageData(newX + 7, newY + 14, 1, 1);
var data52 = imgData52.data;
var imgData53 = context.getImageData(newX + 8, newY + 14, 1, 1);
var data53 = imgData53.data;
var imgData54 = context.getImageData(newX + 9, newY + 14, 1, 1);
var data54 = imgData54.data;
var imgData55 = context.getImageData(newX + 10, newY + 14, 1, 1);
var data55 = imgData55.data;
var imgData56 = context.getImageData(newX + 11, newY + 14, 1, 1);
var data56 = imgData56.data;
var imgData57 = context.getImageData(newX + 12, newY + 14, 1, 1);
var data57 = imgData57.data;
var imgData58 = context.getImageData(newX + 13, newY + 14, 1, 1);
var data58 = imgData58.data;
var canmove = true
var didmove = false

for (var i = 0; i < 4 * 1 * 1; i += 4){
            if (data[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data2[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data3[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data4[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data5[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data6[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data7[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data8[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data9[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data10[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data11[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data12[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data13[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data14[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data15[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data16[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data17[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data18[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data19[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data20[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data21[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data22[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data23[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data24[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data25[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data26[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data27[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data28[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data29[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data30[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data31[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data32[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data33[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data34[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data35[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data36[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data37[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data38[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data39[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data40[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data41[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data42[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data43[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data44[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data45[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data46[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data47[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data48[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data49[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data50[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}

            if (data51[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data52[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data53[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data54[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data55[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data56[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data57[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data58[i] == 69){
newX = player.x;
newY = player.y;
canmove = false;
}
}
if (canmove === true){
player.y = newY;
player.x = newX;
didmove = true;
}
if (didmove === true){
	canmove = true;
	didmove = false;
}
}
function handleKeyDown(evt) {
 
    if(evt.keyCode == 68) // Right
    {
        isRightDown = true;
    }
    if(evt.keyCode == 83) // Down
    {
        isDownDown = true;
    }
    if(evt.keyCode == 87) // Up
    {
        isUpDown = true;
    }
    if(evt.keyCode == 65) // Left
    {
        isLeftDown = true;
    }                   
 
}




function handleKeyUp(evt) {
 
    if(evt.keyCode == 68) // Right
    {
        isRightDown = false;
    }
    if(evt.keyCode == 83) // Down
    {
        isDownDown = false;
    }
    if(evt.keyCode == 87) // Up
    {
        isUpDown = false;
    }
    if(evt.keyCode == 65) // Left
    {
        isLeftDown = false;
    }                   
 
}

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



