//Call the init function as soon as the page has finished loading
window.onload = init;
// Set Up Variables
var canvas, context;
const WIDTH = 600;
const HEIGHT = 400;
const event = new Event('playerMoved');
const maze = {
	screen: '../images/Game_Screen_v4.png',
	start: { x: 515, y: 311 },
	victory: { x: 96, y: 34 },
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
		water: [
			{ x: 474, y: 170 },
			{ x: 394, y: 251 },
			{ x: 354, y: 271 },
			{ x: 95, y: 252 },
			{ x: 215, y: 231 },
		],
		tp: [
			{ x: 314, y: 151 },
			{ x: 513, y: 32 },
			{ x: 454, y: 251 },
			{ x: 114, y: 271 },
			{ x: 134, y: 171 },
		],
		fire: [
			{ x: 254, y: 131 },
			{ x: 114, y: 310 },
			{ x: 514, y: 191 },
			{ x: 454, y: 51 },
			{ x: 334, y: 191 },
		],
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
//Sprite information
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
class Player extends Sprite {
	spriteState = 1;
	movementStates = {
		up: undefined,
		down: undefined,
		left: undefined,
		right: undefined,
	};
	constructor() {
		super(maze.start);
		window.addEventListener('keydown', evt => {
			switch (evt.code) {
				case 'KeyW':
				case 'ArrowUp':
					if (!this.movementStates.up)
						this.movementStates.up = setInterval(
							() => movePlayerY(1),
							10
						);
					break;
				case 'KeyA':
				case 'ArrowLeft':
					if (!this.movementStates.left)
						this.movementStates.left = setInterval(
							() => movePlayerX(-1),
							10
						);
					break;
				case 'KeyS':
				case 'ArrowDown':
					if (!this.movementStates.down)
						this.movementStates.down = setInterval(
							() => movePlayerY(-1),
							10
						);
					break;
				case 'KeyD':
				case 'ArrowRight':
					if (!this.movementStates.right)
						this.movementStates.right = setInterval(
							() => movePlayerX(1),
							10
						);
					break;
			}
		});
		window.addEventListener('keyup', evt => {
			switch (evt.code) {
				case 'KeyW':
				case 'ArrowUp':
					clearInterval(this.movementStates.up);
					this.movementStates.up = undefined;
					break;
				case 'KeyA':
				case 'ArrowLeft':
					clearInterval(this.movementStates.left);
					this.movementStates.left = undefined;
					break;
				case 'KeyS':
				case 'ArrowDown':
					clearInterval(this.movementStates.down);
					this.movementStates.down = undefined;
					break;
				case 'KeyD':
				case 'ArrowRight':
					clearInterval(this.movementStates.right);
					this.movementStates.right = undefined;
					break;
			}
		});
		function startMovement(direction, f) {
			if (!this.movementStates[direction])
				this.movementStates[direction] = setInterval(f, 10);
		}
	}
}
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
		if (spells[wins[this.type]] > 0) {
			spells[wins[this.type]] -= 1;
			this.isVisible = false;
			draw();
		}
	}
}
class SpellSprite extends Sprite {
	type = undefined;
	constructor(loc, type) {
		super(loc);
		this.type = type;
		window.addEventListener(playerMoved);
	}
}

var cursor = {
	x: 0,
	y: 0,
	width: 11,
	height: 11,
	isVisible: true,
};
var wins = {
	pit: 'teleport',
	spike: 'fire',
	fire: 'water',
};
var spells = {
	teleport: 1,
	fire: 0,
	water: 0,
};

const player = new Player();
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
	for (let f = 0; f < maze.spells.fire.length; f++) {
		firespells.push(new TrapSprite(maze.spells.fire[f], 'fire'));
	}
	// //Generate teleport spells
	for (let f = 0; f < maze.spells.tp.length; f++) {
		telespells.push(new TrapSprite(maze.spells.tp[f], 'teleport'));
	}
	// //Generate water spells
	// for (let ws = 0; ws < 6; ws++) {
	for (let f = 0; f < maze.spells.water.length; f++) {
		waterspells.push(new TrapSprite(maze.spells.water[f], 'water'));
	}
	//Listen and handle keypresses
	window.addEventListener('keydown', handleKeyDown, true);
	window.addEventListener('keyup', handleKeyUp, true);
	//Call the update function every 10 milliseconds
	canvas.onmousemove = moveCursor;
	draw();
	//Track cursor movements
}

function draw() {
	//Clear canvas of shapes
	//Potatoes (why did I comment 'Potatoes' here?  This was a sophomore-year me comment.  Present me has no idea, but I can't bring myself to delete it.  Long live the Potatoes.)
	clear();
	context.drawImage(backgroundImage, 0, 0);
	//Draw player
	context.drawImage(playerImage, player.x, player.y);
	context.drawImage(cursorImage, cursor.x, cursor.y);
	//Draw Victory Pickup
	context.drawImage(Victory, maze.victory.x, maze.victory.y);

	//Draw Fireball
	pitfalls.forEach(pitfall => {
		if (pitfall.isVisible) context.drawImage(PitFall, pitfall.x, pitfall.y);
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
	waterspells.forEach(waterspell => {
		if (waterspell.isVisible)
			context.drawImage(WaterSpell, waterspell.x, waterspell.y);
	});
	// //Draw Fire Spell
	firespells.forEach(firespell => {
		if (firespell.isVisible)
			context.drawImage(FireSpell, firespell.x, firespell.y);
	});
	// //Draw Teleport Spell
	telespells.forEach(telespell => {
		if (telespell.isVisible)
			context.drawImage(TeleSpell, telespell.x, telespell.y);
	});

	//Score text font and color
	context.font = '25px Rubik Maze';
	context.fillStyle = '#000000';
	//Display score
	context.fillText(spells.teleport, 50, 37);
	context.fillText(spells.fire, 50, 73);
	context.fillText(spells.water, 50, 107);
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

//Check if object a and object b are colliding
function collides(a, b) {
	return (
		a.x < b.x + b.width &&
		a.x + a.width > b.x &&
		a.y < b.y + b.height &&
		a.y + a.height > b.y
	);
}
function movePlayerX(move) {
	let newX = player.x + move;
	if (
		move > 0 &&
		!context
			.getImageData(newX + player.width, player.y, 1, player.height) //Check to the right of the player when moving right
			.data.includes(54)
	)
		player.x = newX;
	else if (
		move < 0 &&
		!context
			.getImageData(newX, player.y, 1, player.height) //Check to the left of the player when moving left
			.data.includes(54)
	)
		player.x = newX;
	draw();
}
function movePlayerY(move) {
	let newY = player.y - move;
	if (
		move > 0 &&
		!context.getImageData(player.x, newY, player.width, 1).data.includes(54)
	)
		player.y = newY;
	else if (
		move < 0 &&
		!context
			.getImageData(player.x, newY + player.height, player.width, 1)
			.data.includes(54)
	)
		player.y = newY;
	draw();
}
