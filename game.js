import * as Images from './assets/images';
import * as Sounds from './assets/sounds';
import { getAMaze } from './mazes';
import { Scores, formatTime } from './scoreboard';
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
class PlayerSprite extends Sprite {
	movementStates = {
		up: undefined,
		down: undefined,
		left: undefined,
		right: undefined,
	};
	reset() {
		this.x = Maze.current.start.x;
		this.y = Maze.current.start.y;
	}
	constructor() {
		const startMovement = (direction, f) => {
			if (!this.movementStates[direction])
				this.movementStates[direction] = setInterval(f, 16);
		};
		super(Maze.current.start);
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
			if (this.isVisible && collides(this, Cursor)) {
				this.spell();
			}
		});
		GameEvents.events.addEventListener('playerMoved', () => {
			if (this.isVisible && collides(this, Player)) {
				endScreen(Traps.lossScreens[this.type], GameSounds.loss);
			}
		});
	}
	spell() {
		if (Spells.count[Traps.weakness[this.type]] > 0) {
			Spells.count[Traps.weakness[this.type]] -= 1;
			this.isVisible = false;
			Traps.sound[this.type].play();
			draw();
		}
	}
}
class SpellSprite extends Sprite {
	type = undefined;
	checkColission() {}
	constructor(loc, type) {
		super(loc);
		this.type = type;
		GameEvents.events.addEventListener('playerMoved', () => {
			if (this.isVisible && collides(this, Player)) {
				GameSounds.pickUp.play();
				Spells.count[this.type] += 1;
				this.isVisible = false;
			}
		});
	}
}
class GoalSprite extends Sprite {
	constructor() {
		super(Maze.current.victory);
		GameEvents.events.addEventListener('playerMoved', () => {
			if (this.isVisible && collides(this, Player)) {
				endScreen(VictoryImage, GameSounds.victoryMusic);
				gameWin();
			}
		});
	}
	reset() {
		this.x = Maze.current.victory.x;
		this.y = Maze.current.victory.y;
	}
}
// Set Up Variables
const WIDTH = 600,
	HEIGHT = 400,
	canvas = document.getElementById('myCanvas'),
	context = canvas.getContext('2d', { willReadFrequently: true }),
	//Various sounds
	GameSounds = {
		victoryMusic: new Audio(Sounds.WhoLikesToParty),
		gameMusic: new Audio(Sounds.TheComplex),
		pickUp: new Audio(Sounds.Click),
		fire: new Audio(Sounds.Fire),
		water: new Audio(Sounds.Water),
		tp: new Audio(Sounds.Magic),
		loss: new Audio(Sounds.LossBeep),
	},
	//Traps contains all values pertaining to traps including loss screens, weaknesses, sound effects, and currently loaded sprites
	Traps = {
		lossScreens: {
			fire: new Images.Resource(Images.Fire_Loss_Screen),
			spike: new Images.Resource(Images.Spike_Loss_Screen),
			pit: new Images.Resource(Images.Pitfall_Loss_Screen),
		},
		weakness: {
			pit: 'tp',
			spike: 'fire',
			fire: 'water',
		},
		sound: {
			pit: GameSounds.tp,
			spike: GameSounds.fire,
			fire: GameSounds.water,
		},
		images: {
			fire: new Images.Resource(Images.FireTrap),
			spike: new Images.Resource(Images.SpikeTrap),
			pit: new Images.Resource(Images.Pitfall),
		},
		sprites: {},
	},
	//Spells contains a Spell image resources, count of player's available spell, and currently loaded Spell sprites
	Spells = {
		count: {},
		images: {
			fire: new Images.Resource(Images.Fireball),
			tp: new Images.Resource(Images.Teleport),
			water: new Images.Resource(Images.Water),
		},
		sprites: {},
	},
	//Game Events tracks varous events, is reset on new-game
	GameEvents = {
		events: new EventTarget(),
		clear: function () {
			this.events = new EventTarget();
		},
	},
	PlayerMoved = new Event('playerMoved'),
	GameClick = new Event('gameClick'),
	//Timer counts up time taken to complete game
	Timer = {
		time: 0,
		runningTimer: undefined,
		start: function () {
			this.runningTimer = setInterval(() => {
				this.time++;
				draw();
			}, 1000);
		},
		reset: function () {
			this.time = 0;
		},
		stop: function () {
			clearInterval(this.runningTimer);
		},
	},
	//Various images
	splashScreenImage = new Images.Resource(Images.SplashPage),
	cursorImage = new Images.Resource(Images.Cursor),
	playerImage = new Images.Resource(Images.Player),
	backgroundImage = new Images.Resource(Images.Background),
	Victory = new Images.Resource(Images.Ladder),
	VictoryImage = new Images.Resource(Images.Victory_Screen),
	//Maze contains currently retrieved values of maze
	Maze = {
		current: getAMaze(),
		new: function () {
			this.maze = getAMaze();
		},
	},
	//Player sprite tracks and moves player
	Player = new PlayerSprite(),
	//Goal sprite tracks current position of the maze's end goal
	Goal = new GoalSprite(),
	// Cursor settings
	Cursor = {
		x: 0,
		y: 0,
		width: 11,
		height: 11,
		isVisible: true,
	};

var gameRunning = false;

window.addEventListener('mousedown', () =>
	GameEvents.events.dispatchEvent(GameClick)
);
// Dev code: log cursor location on click for easier time assigning maze locations
window.addEventListener('mousedown', () =>
	console.log(`${Cursor.x},${Cursor.y}`)
);

function init() {
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
	// Reset player, timer, victory location, spell counts
	Player.reset();
	Timer.reset();
	Goal.reset();
	Spells.count = {
		tp: 1,
		fire: 0,
		water: 0,
	};
	//Generate maze contents
	for (let key of Object.keys(Maze.current.traps)) {
		Traps.sprites[key] = [];
		for (let trap of Maze.current.traps[key]) {
			Traps.sprites[key].push(new TrapSprite(trap, key));
		}
	}
	for (let key of Object.keys(Maze.current.spells)) {
		Spells.sprites[key] = [];
		for (let spell of Maze.current.spells[key]) {
			Spells.sprites[key].push(new SpellSprite(spell, key));
		}
	}
	//Track mouse movements
	canvas.onmousemove = moveCursor;
	//Start music, timer
	GameSounds.gameMusic.play();
	Timer.start();

	gameRunning = true;
	draw();
}
function draw() {
	if (!gameRunning) {
		return;
	}
	//Clear canvas of shapes
	//Potatoes (why did I comment 'Potatoes' here?  This was a sophomore-year me comment.  Present me has no idea, but I can't bring myself to delete it.  Long live the Potatoes.)
	clear();
	context.drawImage(backgroundImage, 0, 0);
	context.drawImage(Maze.current.screen, 95, 30);
	//Draw player
	context.drawImage(playerImage, Player.x, Player.y);
	context.drawImage(cursorImage, Cursor.x, Cursor.y);
	//Draw Victory Pickup
	context.drawImage(Victory, Goal.x, Goal.y);
	for (let key of Object.keys(Traps.sprites)) {
		for (let trap of Traps.sprites[key]) {
			if (trap.isVisible)
				context.drawImage(Traps.images[key], trap.x, trap.y);
		}
	}
	for (let key of Object.keys(Spells.sprites)) {
		for (let spell of Spells.sprites[key]) {
			if (spell.isVisible)
				context.drawImage(Spells.images[key], spell.x, spell.y);
		}
	}
	//Score text font and color
	[context.font, context.textAlign, context.fillStyle] = [
		'25px Rubik Maze',
		'center',
		'#000000',
	];
	//Display score
	context.fillText(Spells.count.tp, 52, 37);
	context.fillText(Spells.count.fire, 52, 73);
	context.fillText(Spells.count.water, 52, 107);
	[context.font, context.textAlign] = ['20px Rubik Maze', 'right'];
	context.fillText(formatTime(Timer.time), 69, 140);
} //End update function
function clear() {
	context.clearRect(0, 0, WIDTH, HEIGHT); //Erases all items from the context
}
//Move and redraw the cursor image whenever the mouse is moved
function moveCursor(event) {
	Cursor.x = event.pageX - canvas.offsetLeft;
	Cursor.y = event.pageY - canvas.offsetTop;
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
//Moves player horizontally and checks if maze wall is there
function movePlayerX(move) {
	let newX = Player.x + move;
	if (
		(move > 0 &&
			!context
				.getImageData(
					newX + Player.width - 1,
					Player.y,
					1,
					Player.height
				) //Check to the right of the player when moving right
				.data.includes(72)) ||
		(move < 0 &&
			!context
				.getImageData(newX, Player.y, 1, Player.height) //Check to the left of the player when moving left
				.data.includes(72))
	) {
		Player.x = newX;
		GameEvents.events.dispatchEvent(PlayerMoved);
		draw();
	}
}
//Moves player vertically and checks if a maze wall is there
function movePlayerY(move) {
	let newY = Player.y - move;
	if (
		(move > 0 &&
			!context
				.getImageData(Player.x, newY, Player.width, 1)
				.data.includes(72)) ||
		(move < 0 &&
			!context
				.getImageData(
					Player.x,
					newY + Player.height - 1,
					Player.width,
					1
				)
				.data.includes(72))
	) {
		Player.y = newY;
		GameEvents.events.dispatchEvent(PlayerMoved);
		draw();
	}
}
/*Draw a game end screen (Game Over or Victory)
Run various actions that need to be done between games*/
function endScreen(screen, sound) {
	gameRunning = false;
	GameEvents.clear();
	GameSounds.gameMusic.pause();
	GameSounds.gameMusic = new Audio(Sounds.TheComplex);
	sound.play();
	Timer.stop();
	clear();
	context.drawImage(screen, 0, 0);
	//Listen for player click on splash screen and restart the game on click
	canvas.onmousedown = () => {
		canvas.onmousedown = undefined;
		sound.pause();
		game();
	};
}
function gameWin() {
	//Run actions specific to post-victory game runs
	console.log(`Game won in ${formatTime(Timer.time)}`);
	Scores.addTime(Timer.time, Maze.current.mazeID);
	Maze.new();
}
