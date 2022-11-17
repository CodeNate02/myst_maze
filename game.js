import * as Images from './assets/images';
import * as Sounds from './assets/sounds';

// Set Up Variables
var canvas, context;
var gameRunning = false;

const GameSounds = {
	victoryMusic: new Audio(Sounds.WhoLikesToParty),
	gameMusic: new Audio(Sounds.TheComplex),
	pickUp: new Audio(Sounds.Click),
	fire: new Audio(Sounds.Fire),
	water: new Audio(Sounds.Water),
	tp: new Audio(Sounds.Magic),
	loss: new Audio(Sounds.LossBeep),
};
const Traps = {
	lossScreens: {
		fire: ImageResource(Images.Fire_Loss_Screen),
		spike: ImageResource(Images.Spike_Loss_Screen),
		pit: ImageResource(Images.Pitfall_Loss_Screen),
	},
	weakness: {
		pit: 'teleport',
		spike: 'fire',
		fire: 'water',
	},
	sound: {
		pit: GameSounds.tp,
		spike: GameSounds.fire,
		fire: GameSounds.water,
	},
};
const WIDTH = 600;
const HEIGHT = 400;
const playerMoved = new Event('playerMoved'),
	gameOver = new Event('gameOver'),
	gameClick = new Event('gameClick');
const GameEvents = {
	events: new EventTarget(),
	clear: function () {
		this.events = new EventTarget();
	},
};
window.addEventListener('mousedown', () =>
	GameEvents.events.dispatchEvent(gameClick)
);

const maze = {
	screen: Images.Background,
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
const splashScreenImage = ImageResource(Images.SplashPage),
	cursorImage = ImageResource(Images.Cursor),
	playerImage = ImageResource(Images.Player),
	FireTrap = ImageResource(Images.FireTrap),
	SpikeTrap = ImageResource(Images.SpikeTrap),
	PitFall = ImageResource(Images.Pitfall),
	backgroundImage = ImageResource(Images.Background),
	FireSpell = ImageResource(Images.Fireball),
	TeleSpell = ImageResource(Images.Teleport),
	WaterSpell = ImageResource(Images.Water),
	Victory = ImageResource(Images.Ladder),
	VictoryImage = ImageResource(Images.Victory_Screen);

const Timer = {
	time: 0,
	runningTimer: undefined,
	start: function () {
		this.runningTimer = setInterval(() => {
			this.time++;
			draw();
		}, 1000);
	},
	reset: function () {
		this.startTime = 0;
	},
	stop: function () {
		clearInterval(this.runningTimer);
	},
};
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
	reset() {
		this.x = maze.start.x;
		this.y = maze.start.y;
	}
	constructor() {
		const startMovement = (direction, f) => {
			if (!this.movementStates[direction])
				this.movementStates[direction] = setInterval(f, 16);
		};
		super(maze.start);
		window.addEventListener('keydown', evt => {
			if (gameRunning)
				switch (evt.code) {
					case 'KeyW':
					case 'ArrowUp':
						startMovement('up', () => movePlayerY(1));
						break;
					case 'KeyA':
					case 'ArrowLeft':
						startMovement('left', () => movePlayerX(-1));
						break;
					case 'KeyS':
					case 'ArrowDown':
						startMovement('down', () => movePlayerY(-1));
						break;
					case 'KeyD':
					case 'ArrowRight':
						startMovement('right', () => movePlayerX(1));
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
	}
}
class TrapSprite extends Sprite {
	type = undefined;
	constructor(loc, type) {
		super(loc);
		this.type = type;
		GameEvents.events.addEventListener('gameClick', () => {
			if (this.isVisible && collides(this, cursor)) {
				this.spell();
			}
		});
		GameEvents.events.addEventListener('playerMoved', () => {
			if (this.isVisible && collides(this, player)) {
				endScreen(Traps.lossScreens[this.type], GameSounds.loss);
			}
		});
	}
	spell() {
		if (spells[Traps.weakness[this.type]] > 0) {
			spells[Traps.weakness[this.type]] -= 1;
			this.isVisible = false;
			Traps.sound[this.type].play();
			draw();
		}
	}
}
class SpellSprite extends Sprite {
	type = undefined;
	checkColission() {
		if (this.isVisible && collides(this, player)) {
			GameSounds.pickUp.play();
			spells[this.type] += 1;
			this.isVisible = false;
		}
	}
	clear = function () {
		window.removeEventListener('playerMoved', () => this.checkColission());
		window.removeEventListener('gameOver', () => this.clear());
	};
	constructor(loc, type) {
		super(loc);
		this.type = type;
		GameEvents.events.addEventListener('playerMoved', () =>
			this.checkColission()
		);
		window.addEventListener('gameOver', () => clear());
	}
}
class Goal extends Sprite {
	constructor() {
		super(maze.victory);
		GameEvents.events.addEventListener('playerMoved', () => {
			if (this.isVisible && collides(this, player)) {
				endScreen(VictoryImage, GameSounds.victoryMusic);
			}
		});
	}
}

var cursor = {
	x: 0,
	y: 0,
	width: 11,
	height: 11,
	isVisible: true,
};

var spells;

var player = new Player();
// Cursor settings

var victory = new Goal(),
	spiketraps = [],
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
export default init;

// Set Up Functions
function game() {
	player.reset();
	Timer.reset();
	spells = {
		teleport: 1,
		fire: 0,
		water: 0,
	};
	GameSounds.gameMusic.play();
	//Generate Fire Traps

	firetraps = [];
	for (let f = 0; f < maze.traps.fire.length; f++) {
		firetraps.push(new TrapSprite(maze.traps.fire[f], 'fire'));
	}
	spiketraps = [];
	// //Generate Spike Traps
	for (let f = 0; f < maze.traps.spike.length; f++) {
		spiketraps.push(new TrapSprite(maze.traps.spike[f], 'spike'));
	}
	pitfalls = [];
	// //Generate pitfalls
	for (let f = 0; f < maze.traps.pit.length; f++) {
		pitfalls.push(new TrapSprite(maze.traps.pit[f], 'pit'));
	}
	firespells = [];
	// //Generate fire spells
	for (let f = 0; f < maze.spells.fire.length; f++) {
		firespells.push(new SpellSprite(maze.spells.fire[f], 'fire'));
	}
	telespells = [];
	// //Generate teleport spells
	for (let f = 0; f < maze.spells.tp.length; f++) {
		telespells.push(new SpellSprite(maze.spells.tp[f], 'teleport'));
	}
	waterspells = [];
	// //Generate water spells
	// for (let ws = 0; ws < 6; ws++) {
	for (let f = 0; f < maze.spells.water.length; f++) {
		waterspells.push(new SpellSprite(maze.spells.water[f], 'water'));
	}
	canvas.onmousemove = moveCursor;
	gameRunning = true;
	Timer.start();
	draw();
	//Track cursor movements
}

function draw() {
	if (!gameRunning) {
		return;
	}
	//Clear canvas of shapes
	//Potatoes (why did I comment 'Potatoes' here?  This was a sophomore-year me comment.  Present me has no idea, but I can't bring myself to delete it.  Long live the Potatoes.)
	clear();
	context.drawImage(backgroundImage, 0, 0);
	//Draw player
	context.drawImage(playerImage, player.x, player.y);
	context.drawImage(cursorImage, cursor.x, cursor.y);
	//Draw Victory Pickup
	context.drawImage(Victory, victory.x, victory.y);

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
	context.font = '20px Rubik Maze';
	context.fillText(formatTime(Timer.time), 29, 140);
} //End update function

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
		(move > 0 &&
			!context
				.getImageData(
					newX + player.width - 1,
					player.y,
					1,
					player.height
				) //Check to the right of the player when moving right
				.data.includes(54)) ||
		(move < 0 &&
			!context
				.getImageData(newX, player.y, 1, player.height) //Check to the left of the player when moving left
				.data.includes(54))
	) {
		player.x = newX;
		GameEvents.events.dispatchEvent(playerMoved);
		draw();
	}
}
function movePlayerY(move) {
	let newY = player.y - move;
	if (
		(move > 0 &&
			!context
				.getImageData(player.x, newY, player.width, 1)
				.data.includes(54)) ||
		(move < 0 &&
			!context
				.getImageData(
					player.x,
					newY + player.height - 1,
					player.width,
					1
				)
				.data.includes(54))
	) {
		player.y = newY;
		GameEvents.events.dispatchEvent(playerMoved);
		draw();
	}
}
function endScreen(screen, sound) {
	GameEvents.clear();
	Timer.stop();
	GameSounds.gameMusic.pause();
	(GameSounds.gameMusic = new Audio(Sounds.TheComplex)),
		(gameRunning = false);
	context.drawImage(screen, 0, 0);
	sound.play();
	clear();
	context.drawImage(screen, 0, 0);
	//Listen for player click on splash screen
	canvas.onmousedown = () => {
		canvas.onmousedown = undefined;
		sound.pause();
		game();
	};
}
function formatTime(time) {
	let minutes = Math.floor(time / 60);
	let seconds = time % 60;
	return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}
