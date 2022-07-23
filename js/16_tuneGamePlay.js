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
var spell1 = 1;
var spell2 = 0;
var spell3 = 0;
var score;
var message1 = spell1;
var message2 = spell2;
var message3 = spell3;

//Keyboard Control Variables
var isUpDown = false;
var isDownDown = false;
var isRightDown = false;
var isLeftDown = false;
var isWDown = false;
var isADown = false;
var isSDown = false;
var isDDown = false;
var isQDown = false;
var speed = 1.5;

//Maze Variables
var newY = 311;
var newX = 515;


// Cursor image settings
var cursor = new Sprite2();
var cursorImage = new Image();
cursorImage.src = "images/Game_Art/MouseCursor.png";

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
backgroundImage.src = "images/Game_Art/Game_Screen_v4.png";

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
    victories[v].width = 15;
    victories[v].height = 15;
}



var firetraps = [];
for (var f = 0; f < 6; f++)   {
	firetraps.push(new Sprite());
    firetraps[f].width = 15;
    firetraps[f].height = 15;
}

var spiketraps = [];
for (var s = 0; s < 6; s++)   {
	spiketraps.push(new Sprite());
    spiketraps[s].width = 15;
    spiketraps[s].height = 15;
}

var pitfalls = [];
for (var p = 0; p < 6; p++)   {
	pitfalls.push(new Sprite());
    pitfalls[p].width = 15;
    pitfalls[p].height = 15;
}

var firespells = [];
for (var fs = 0; fs < 6; fs++)   {
	firespells.push(new Sprite());
    firespells[fs].width = 10;
    firespells[fs].height = 18;
}

var telespells = [];
for (var ts = 0; ts < 6; ts++)   {
	telespells.push(new Sprite());
    telespells[ts].width = 15;
    telespells[ts].height = 15;
}

var waterspells = [];
for (var ws = 0; ws < 6; ws++)   {
	waterspells.push(new Sprite());
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

//Call the function movePlayer when the mouse moves
canvas.onmousemove = moveCursor;

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


//Draw player
context.drawImage(playerImage, player.x, player.y);

 handleInput();

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
for (var f = 0; f < 6; f++) {
    var firetrap = firetraps[f];
 
 if(f == 1){
 	firetrap.x = 134;
 	firetrap.y = 291;
 }
 
 if(f == 2){
 	firetrap.x = 253;
 	firetrap.y = 271;
 }
 
 if(f == 3){
 	firetrap.x = 394;
 	firetrap.y = 171;
 }
 
 if (f == 4){
 	firetrap.x = 414;
 	firetrap.y = 91;
 }

if (f == 5){
	firetrap.x = 114;
	firetrap.y = 72;
}
 
 if(firetrap.isVisible){
 	context.drawImage(FireTrap, firetrap.x, firetrap.y)
 }
 
 if(firetrap.isVisible & collides(cursor, firetrap) & isQDown == true & spell3 > 0){
    	firetrap.isVisible = false;
    	spell3 = spell3 - 1
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
for (var s = 0; s < 6; s++) {
    var spiketrap = spiketraps[s];
    
     if(s == 1){
 	spiketrap.x = 96;
 	spiketrap.y = 171;
 }
 
 if(s == 2){
 	spiketrap.x = 113;
 	spiketrap.y = 231;
 }
 
 if(s == 3){
 	spiketrap.x = 314;
 	spiketrap.y = 71;
 }
 
 if (s == 4){
 	spiketrap.x = 273;
 	spiketrap.y = 211;
 }

if (s == 5){
	spiketrap.x = 434;
	spiketrap.y = 231;
}
    
    if (spiketrap.isVisible == true) {
        context.drawImage(SpikeTrap, spiketrap.x, spiketrap.y);
    }
 
    //Check for collisions between the player and collectable. Also check if the collectable is visible
    if(spiketrap.isVisible & collides(player, spiketrap)){
	spiketrap.isVisible = false;
	
	window.open("00_spikeLoss.html", "_self");
    }
    
    if(spiketrap.isVisible & collides(cursor, spiketrap) & isQDown == true & spell2 > 0){
    	spiketrap.isVisible = false;
    	spell2 = spell2 - 1
}
}

//Draw Pitfall
for (var p = 0; p < 6; p++) {
    var pitfall = pitfalls[p];
    
     if(p == 1){
 	pitfall.x = 375;
 	pitfall.y = 291;
 }
 
 if(p == 2){
 	pitfall.x = 294;
 	pitfall.y = 311;
 }
 
 if(p == 3){
 	pitfall.x = 454;
 	pitfall.y = 151;
 }
 
 if (p == 4){
 	pitfall.x = 215;
 	pitfall.y = 91;
 }

if (p == 5){
	pitfall.x = 114;
	pitfall.y = 91;
}
    
    if (pitfall.isVisible == true) {
        context.drawImage(PitFall, pitfall.x, pitfall.y);
    }
    if(pitfall.isVisible & collides(cursor, pitfall) & isQDown == true & spell1 > 0){
    	pitfall.isVisible = false;
    	spell1 = spell1 - 1
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
for (var ws = 0; ws < 6; ws++) {
    var waterspell = waterspells[ws];
    
     if(ws == 1){
 	waterspell.x = 474;
 	waterspell.y = 170;
 }
 
 if(ws == 2){
 	waterspell.x = 394;
 	waterspell.y = 251;
 }
 
 if(ws == 3){
 	waterspell.x = 354;
 	waterspell.y = 271;
 }
 
 if (ws == 4){
 	waterspell.x = 95;
 	waterspell.y = 252;
 }

if (ws == 5){
	waterspell.x = 215;
	waterspell.y = 231;
}
    
    if (waterspell.isVisible == true) {
        context.drawImage(WaterSpell, waterspell.x, waterspell.y);
    }
 
    //Check for collisions between the player and collectable. Also check if the collectable is visible
    if(waterspell.isVisible & collides(player, waterspell)){
    	collectableSound.play();
        //If a collision occurs and the enemy is visible, decrease the score
	spell3 ++;
	//Change the enemy's visibility to false so that it only get picked up once
	waterspell.isVisible = false;
	
    }
} 

//Draw Fire Spell
for (var fs = 0; fs < 6; fs++) {
    var firespell = firespells[fs];
    
     if(fs == 1){
 	firespell.x = 114;
 	firespell.y = 310;
 }
 
 if(fs == 2){
 	firespell.x = 254;
 	firespell.y = 131;
 }
 
 if(fs == 3){
 	firespell.x = 514;
 	firespell.y = 191;
 }
 
 if (fs == 4){
 	firespell.x = 454;
 	firespell.y = 51;
 }

if (fs == 5){
	firespell.x = 334;
	firespell.y = 191;
}
    
    if (firespell.isVisible == true) {
        context.drawImage(FireSpell, firespell.x, firespell.y);
    }
 
    //Check for collisions between the player and collectable. Also check if the collectable is visible
    if(firespell.isVisible & collides(player, firespell)){
    	collectableSound.play();
        //If a collision occurs and the enemy is visible, decrease the score
	spell2 ++;
	//Change the enemy's visibility to false so that it only get picked up once
	firespell.isVisible = false;
	
    }
}

  //Draw Teleport Spell
for (var ts = 0; ts < 6; ts++) {
    var telespell = telespells[ts];
    
     if(ts == 1){
 	telespell.x = 314;
 	telespell.y = 151;
 }
 
 if(ts == 2){
 	telespell.x = 513;
 	telespell.y = 32;
 }
 
 if(ts == 3){
 	telespell.x = 454;
 	telespell.y = 251;
 }
 
 if (ts == 4){
 	telespell.x = 114;
 	telespell.y = 271;
 }

if (ts == 5){
	telespell.x = 134;
	telespell.y = 171;
}
    
    if (telespell.isVisible == true) {
        context.drawImage(TeleSpell, telespell.x, telespell.y);
    }
 
 
 
    //Check for collisions between the player and collectable. Also check if the collectable is visible
    if(telespell.isVisible & collides(player, telespell)){
    	collectableSound.play();
        //If a collision occurs and the enemy is visible, decrease the score
	spell1 ++;
	//Change the enemy's visibility to false so that it only get picked up once
	telespell.isVisible = false;
    }
}



context.fillStyle="#787878";
context.fillRect(0,0,20,150);    
    
     //Draw cursor
context.drawImage(cursorImage, cursor.x, cursor.y);

    //Score text font and color
context.font = "25px impact";
context.fillStyle = "#000000";

//Display score
 message1 = spell1;
 context.fillText(message1, 50, 42);
 
 message2 = spell2;
 context.fillText(message2, 50, 80);
 
 message3 = spell3;
 context.fillText(message3, 50, 110);
 
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

if(isWDown){
		newY = player.y-speed;
	}
	if(isSDown){
		newY = player.y + speed;
	}
	
	if(isADown){
		newX = player.x - speed;
	}
	if(isDDown){
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
            if (data[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data2[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data3[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data4[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data5[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data6[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data7[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data8[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data9[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data10[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data11[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data12[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data13[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data14[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data15[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data16[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data17[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data18[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data19[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data20[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data21[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data22[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data23[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data24[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data25[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data26[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data27[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data28[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data29[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data30[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data31[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data32[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data33[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data34[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data35[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data36[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data37[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data38[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data39[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data40[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data41[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data42[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data43[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data44[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data45[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data46[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data47[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data48[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data49[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data50[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}

            if (data51[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data52[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data53[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data54[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data55[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data56[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data57[i] == 54){
newX = player.x;
newY = player.y;
canmove = false;
}
            if (data58[i] == 54){
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
        isDDown = true;
    }
    if(evt.keyCode == 83) // Down
    {
        isSDown = true;
    }
    if(evt.keyCode == 87) // Up
    {
        isWDown = true;
    }
    if(evt.keyCode == 65) // Left
    {
        isADown = true;
    }
    
    if(evt.keyCode == 37) // Right
    {
        isLeftDown = true;
    }
    if(evt.keyCode == 38) // Down
    {
        isUpDown = true;
    }
    if(evt.keyCode == 39) // Up
    {
        isRightDown = true;
    }
    if(evt.keyCode == 40) // Left
    {
        isDownDown = true;
    }
    
    if(evt.keyCode == 81) //Q
    {
        isQDown = true;
    }
}




function handleKeyUp(evt) {
 
    if(evt.keyCode == 68) // Right
    {
        isDDown = false;
    }
    if(evt.keyCode == 83) // Down
    {
        isSDown = false;
    }
    if(evt.keyCode == 87) // Up
    {
        isWDown = false;
    }
    if(evt.keyCode == 65) // Left
    {
        isADown = false;
    }
    
      if(evt.keyCode == 37) // Right
    {
        isLeftDown = false;
    }
    if(evt.keyCode == 38) // Down
    {
        isUpDown = false;
    }
    if(evt.keyCode == 39) // Up
    {
        isRightDown = false;
    }
    if(evt.keyCode == 40) // Left
    {
        isDownDown = false;
    }
    if(evt.keyCode == 81) // Q
    {
        isQDown = false;
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

function Sprite2() {
    this.x = 0;
    this.y = 0;
    this.width = 11;
    this.height = 11;
    this.isVisible = true;
}

function moveCursor(event) {
    cursor.x = event.pageX - canvas.offsetLeft;
    cursor.y = event.pageY - canvas.offsetTop;
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



