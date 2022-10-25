// Set Up Variables
var canvas, context;
const WIDTH = 600;
const HEIGHT = 400;
const event = new Event('playerMoved');
const maze = {
	screen: '../images/Game_Screen_v4.png',
	start: { x: 515, y: 311 },
	victory: { x: 98, y: 34 },
	traps: {
		fire: [
			{ x: 134, y: 291 },
			{ x: 253, y: 271 },
			{ x: 394, y: 171 },
			{ x: 414, y: 91 },
			{ x: 114, y: 72 },
		],
		pit: [
			{ x: 375, y: 291 },
			{ x: 294, y: 311 },
			{ x: 454, y: 151 },
			{ x: 215, y: 91 },
			{ x: 114, y: 91 },
		],
		spike: [
			{ x: 96, y: 171 },
			{ x: 113, y: 231 },
			{ x: 314, y: 71 },
			{ x: 273, y: 211 },
			{ x: 434, y: 231 },
		],
	},
	spells: {
		water: [],
		tp: [],
		fire: [],
	},
};
//Load image assets
const splashScreenImage = ImageResource('../images/SplashPage.png'),
	cursorImage = ImageResource('../images/MouseCursor.png'),
	playerImage = ImageResource('../images/Player.png'),
	FireTrap = ImageResource('../images/Fire_Trap.png'),
	SpikeTrap = ImageResource('../images/Spike_Trap.png'),
	PitFall = ImageResource('../images/Pitfall.png'),
	backgroundImage = ImageResource('../images/Game_Screen_v4.png'),
	FireSpell = ImageResource('../images/Fireball.png'),
	TeleSpell = ImageResource('../images/Teleport.png'),
	WaterSpell = ImageResource('../images/Water.png'),
	Victory = ImageResource('../images/Ladder.png'),
	collectableSound = new Audio('../sounds/click.wav');
//Sprite location information
class Sprite {
	isVisible = true;
	width = 15;
	height = 15;
	x;
	y;
	constructor(loc) {
		this.x = loc.x;
		this.y = loc.y;
	}
}
class PlayerSprite extends Sprite {
	constructor() {
		super(maze.start);
	}
}
var player = new PlayerSprite();
var cursor = {
	x: 0,
	y: 0,
	width: 11,
	height: 11,
	isVisible: true,
};
var spells = [1, 0, 0];
//0: Teleport, 1: Fire, 2: Water

class TrapSprite extends Sprite {
	type = undefined;
	constructor(loc, type) {
		super(loc);
		this.type = type;
		window.addEventListener('click', () => {
			if (collides(this, cursor) && this.isVisible) {
				this.spell();
			}
		});
		window.addEventListener('playermoved', () => {
			if (collides(this, player) && this.isVisible) {
				console.log('Collision detected!');
			}
		});
	}
	spell() {
		switch (this.type) {
			case 'pitfall':
				if (spells[0] > 0) {
					spells[0] -= 1;
					this.isVisible = false;
				}
				break;
			case 'spike':
				if (spells[1] > 0) {
					spells[1] -= 1;
					this.isVisible = false;
				}
				break;
			case 'fire':
				if (spells[2] > 0) {
					spells[2] -= 1;
					this.isVisible = false;
				}
				break;
		}
		draw();
	}
}
var score = 0;

//Keyboard Control Variables
var isUpDown = false;
isDownDown = false;
isRightDown = false;
isLeftDown = false;
isWDown = false;
isADown = false;
isSDown = false;
isDDown = false;
isQDown = false;
speed = 1.5;
newX = 515;
newY = 311;
// splash screen image settings

splashScreenClicked = false;
// Cursor settings

victory = new Sprite({ x: maze.victory.x });
var spiketraps = [],
	firetraps = [],
	pitfalls = [],
	firespells = [],
	telespells = [],
	waterspells = [];

function init() {
	canvas = document.getElementById('myCanvas');
	context = canvas.getContext('2d');
	//Draw splash screen
	context.drawImage(splashScreenImage, 0, 0);
	//Listen for player click on splash screen
	canvas.onmousedown = () => {
		canvas.onmousedown = undefined;
		game();
	};
}

// Set Up Functions
function game() {
	//Generate victory element
	//Generate Fire Traps
	for (let f = 0; f < maze.traps.fire.length; f++) {
		firetraps.push(new TrapSprite(maze.traps.fire[f], 'fire'));
	}
	// //Generate Spike Traps
	for (let f = 0; f < maze.traps.spike.length; f++) {
		spiketraps.push(new TrapSprite(maze.traps.spike[f], 'spike'));
	}
	// //Generate pitfalls
	for (let f = 0; f < maze.traps.pit.length; f++) {
		pitfalls.push(new TrapSprite(maze.traps.pit[f], 'pit'));
	}
	// //Generate fire spells
	// for (let fs = 0; fs < 6; fs++) {
	// 	firespells.push(new Sprite());
	// 	firespells[fs].width = 10;
	// 	firespells[fs].height = 18;
	// }
	// //Generate teleport spells
	// for (let ts = 0; ts < 6; ts++) {
	// 	telespells.push(new Sprite());
	// 	telespells[ts].width = 15;
	// 	telespells[ts].height = 15;
	// }
	// //Generate water spells
	// for (let ws = 0; ws < 6; ws++) {
	// 	waterspells.push(new Sprite());
	// 	waterspells[ws].width = 20;
	// 	waterspells[ws].height = 20;
	// }
	//Listen and handle keypresses
	window.addEventListener('keydown', handleKeyDown, true);
	window.addEventListener('keyup', handleKeyUp, true);
	//Call the update function every 10 milliseconds
	canvas.onmousemove = moveCursor;
	//setInterval(draw, 50);
	draw();
	//Track cursor movements
}

function draw() {
	//Clear canvas of shapes
	//Potatoes (why did I comment 'Potatoes' here?  This was a sophomore-year me comment.  Present me has no idea, but I can't bring myself to delete it.  Long live the Potatoes.)
	clear();
	//Draw splashscreen
	context.drawImage(backgroundImage, 0, 0);
	//Draw player
	context.drawImage(playerImage, player.x, player.y);
	//Draw Victory Pickup
	context.drawImage(Victory, victory.x, victory.y);
	//Draw Fireball
	pitfalls.forEach(pitfall => {
		if (pitfall.isVisible)
			context.drawImage(PitFall, pitfall.x, pitfall.y);
	});
	//Draw Spike Trap
	spiketraps.forEach(spiketrap => {
		if (spiketrap.isVisible)
			context.drawImage(SpikeTrap, spiketrap.x, spiketrap.y);
	});
	//Draw Fireball
	firetraps.forEach(firetrap => {
		if (firetrap.isVisible)
			context.drawImage(FireTrap, firetrap.x, firetrap.y);
	});
	// //Draw Water Spell
	// for (var ws = 0; ws < 6; ws++) {
	// 	var waterspell = waterspells[ws];

	// 	if (ws == 1) {
	// 		waterspell.x = 474;
	// 		waterspell.y = 170;
	// 	}

	// 	if (ws == 2) {
	// 		waterspell.x = 394;
	// 		waterspell.y = 251;
	// 	}

	// 	if (ws == 3) {
	// 		waterspell.x = 354;
	// 		waterspell.y = 271;
	// 	}

	// 	if (ws == 4) {
	// 		waterspell.x = 95;
	// 		waterspell.y = 252;
	// 	}

	// 	if (ws == 5) {
	// 		waterspell.x = 215;
	// 		waterspell.y = 231;
	// 	}

	// 	if (waterspell.isVisible == true) {
	// 		context.drawImage(WaterSpell, waterspell.x, waterspell.y);
	// 	}

	// 	//Check for collisions between the player and collectable. Also check if the collectable is visible
	// 	if (waterspell.isVisible & collides(player, waterspell)) {
	// 		collectableSound.play();
	// 		//If a collision occurs and the enemy is visible, decrease the score
	// 		spells[2]++;
	// 		//Change the enemy's visibility to false so that it only get picked up once
	// 		waterspell.isVisible = false;
	// 	}
	// }
	// //Draw Fire Spell
	// for (var fs = 0; fs < 6; fs++) {
	// 	var firespell = firespells[fs];

	// 	if (fs == 1) {
	// 		firespell.x = 114;
	// 		firespell.y = 310;
	// 	}

	// 	if (fs == 2) {
	// 		firespell.x = 254;
	// 		firespell.y = 131;
	// 	}

	// 	if (fs == 3) {
	// 		firespell.x = 514;
	// 		firespell.y = 191;
	// 	}

	// 	if (fs == 4) {
	// 		firespell.x = 454;
	// 		firespell.y = 51;
	// 	}

	// 	if (fs == 5) {
	// 		firespell.x = 334;
	// 		firespell.y = 191;
	// 	}

	// 	if (firespell.isVisible == true) {
	// 		context.drawImage(FireSpell, firespell.x, firespell.y);
	// 	}

	// 	//Check for collisions between the player and collectable. Also check if the collectable is visible
	// 	if (firespell.isVisible & collides(player, firespell)) {
	// 		collectableSound.play();
	// 		//If a collision occurs and the enemy is visible, decrease the score
	// 		spells[1]++;
	// 		//Change the enemy's visibility to false so that it only get picked up once
	// 		firespell.isVisible = false;
	// 	}
	// }
	// //Draw Teleport Spell
	// for (var ts = 0; ts < 6; ts++) {
	// 	var telespell = telespells[ts];

	// 	if (ts == 1) {
	// 		telespell.x = 314;
	// 		telespell.y = 151;
	// 	}

	// 	if (ts == 2) {
	// 		telespell.x = 513;
	// 		telespell.y = 32;
	// 	}

	// 	if (ts == 3) {
	// 		telespell.x = 454;
	// 		telespell.y = 251;
	// 	}

	// 	if (ts == 4) {
	// 		telespell.x = 114;
	// 		telespell.y = 271;
	// 	}

	// 	if (ts == 5) {
	// 		telespell.x = 134;
	// 		telespell.y = 171;
	// 	}

	// 	if (telespell.isVisible == true) {
	// 		context.drawImage(TeleSpell, telespell.x, telespell.y);
	// 	}

	// 	//Check for collisions between the player and collectable. Also check if the collectable is visible
	// 	if (telespell.isVisible & collides(player, telespell)) {
	// 		collectableSound.play();
	// 		//If a collision occurs and the enemy is visible, decrease the score
	// 		spells[0]++;
	// 		//Change the enemy's visibility to false so that it only get picked up once
	// 		telespell.isVisible = false;
	// 	}
	// }
	context.drawImage(cursorImage, cursor.x, cursor.y);
	context.fillStyle = '#787878';
	context.fillRect(0, 0, 20, 150);

	//Score text font and color
	context.font = '25px Rubik Maze';
	context.fillStyle = '#000000';
	//Display score
	context.fillText(spells[0], 50, 37);
	context.fillText(spells[1], 50, 73);
	context.fillText(spells[2], 50, 107);
} //End update function

function handleInput() {
	if (isUpDown) {
		newY = player.y - speed;
	}
	if (isDownDown) {
		newY = player.y + speed;
	}

	if (isLeftDown) {
		newX = player.x - speed;
	}
	if (isRightDown) {
		newX = player.x + speed;
	}

	if (isWDown) {
		newY = player.y - speed;
	}
	if (isSDown) {
		newY = player.y + speed;
	}

	if (isADown) {
		newX = player.x - speed;
	}
	if (isDDown) {
		newX = player.x + speed;
	}
	console.log('moving!');
	var canmove = true;
	var didmove = false;
	for (let i = 0; i <= 14; i++) {
		if (context.getImageData(newX, newY + i, 1, 1).data[0] == 54) {
			newX = player.x;
			newY = player.y;
			canmove = false;
		} else if (context.getImageData(newX + i, newY, 1, 1).data[0] == 54) {
			newX = player.x;
			newY = player.y;
			canmove = false;
		} else if (
			context.getImageData(newX + 14, newY + i, 1, 1).data[0] == 54
		) {
			newX = player.x;
			newY = player.y;
			canmove = false;
		} else if (
			context.getImageData(newX + i, newY + 14, 1, 1).data[0] == 54
		) {
			newX = player.x;
			newY = player.y;
			canmove = false;
		}
	}
	if (canmove === true) {
		player.y = newY;
		player.x = newX;
		didmove = true;
	}
	if (didmove === true) {
		canmove = true;
		didmove = false;
	}
}
function handleKeyDown(evt) {
	if (evt.keyCode == 68) {
		// Right
		isDDown = true;
	}
	if (evt.keyCode == 83) {
		// Down
		isSDown = true;
	}
	if (evt.keyCode == 87) {
		// Up
		isWDown = true;
	}
	if (evt.keyCode == 65) {
		// Left
		isADown = true;
	}

	if (evt.keyCode == 37) {
		// Right
		isLeftDown = true;
	}
	if (evt.keyCode == 38) {
		// Down
		isUpDown = true;
	}
	if (evt.keyCode == 39) {
		// Up
		isRightDown = true;
	}
	if (evt.keyCode == 40) {
		// Left
		isDownDown = true;
	}

	if (evt.keyCode == 81) {
		//Q
		isQDown = true;
	}
}

function handleKeyUp(evt) {
	if (evt.keyCode == 68) {
		// Right
		isDDown = false;
	}
	if (evt.keyCode == 83) {
		// Down
		isSDown = false;
	}
	if (evt.keyCode == 87) {
		// Up
		isWDown = false;
	}
	if (evt.keyCode == 65) {
		// Left
		isADown = false;
	}

	if (evt.keyCode == 37) {
		// Right
		isLeftDown = false;
	}
	if (evt.keyCode == 38) {
		// Down
		isUpDown = false;
	}
	if (evt.keyCode == 39) {
		// Up
		isRightDown = false;
	}
	if (evt.keyCode == 40) {
		// Left
		isDownDown = false;
	}
	if (evt.keyCode == 81) {
		// Q
		isQDown = false;
	}
}

function clear() {
	context.clearRect(0, 0, WIDTH, HEIGHT);
}

function ImageResource(src) {
	let img = new Image();
	img.src = src;
	return img;
}

function moveCursor(event) {
	cursor.x = event.pageX - canvas.offsetLeft;
	cursor.y = event.pageY - canvas.offsetTop;
	draw();
}

//Call the init function as soon as the page has finished loading
window.onload = init;

//Check if object a and object b are colliding
function collides(a, b) {
	return (
		a.x < b.x + b.width &&
		a.x + a.width > b.x &&
		a.y < b.y + b.height &&
		a.y + a.height > b.y
	);
}
