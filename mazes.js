import MazeImgs from './assets/mazes';
const Mazes = [
	// {
	//     mazeID: 'Classic',
	//     screen: MazeImgs.classic,
	//     start: { x: 515, y: 311 },
	//     victory: { x: 98, y: 34 },
	//     traps: {
	//         fire: [
	//             { x: 136, y: 291 },
	//             { x: 255, y: 271 },
	//             { x: 396, y: 171 },
	//             { x: 416, y: 91 },
	//             { x: 116, y: 72 },
	//         ],
	//         pit: [
	//             { x: 377, y: 291 },
	//             { x: 296, y: 311 },
	//             { x: 456, y: 151 },
	//             { x: 217, y: 91 },
	//             { x: 116, y: 91 },d
	//         ],
	//         spike: [
	//             { x: 98, y: 171 },
	//             { x: 115, y: 231 },
	//             { x: 316, y: 71 },
	//             { x: 275, y: 211 },
	//             { x: 436, y: 231 },
	//         ],
	//     },
	//     spells: {
	//         water: [
	//             { x: 476, y: 170 },
	//             { x: 396, y: 251 },
	//             { x: 356, y: 271 },
	//             { x: 97, y: 252 },
	//             { x: 217, y: 231 },
	//         ],
	//         tp: [
	//             { x: 316, y: 151 },
	//             { x: 515, y: 32 },
	//             { x: 456, y: 251 },
	//             { x: 116, y: 271 },
	//             { x: 136, y: 171 },
	//         ],
	//         fire: [
	//             { x: 256, y: 131 },
	//             { x: 116, y: 310 },
	//             { x: 516, y: 191 },
	//             { x: 456, y: 51 },
	//             { x: 336, y: 191 },
	//         ],
	//     },
	// },
	{
		mazeID: 'Maze_Two',
		screen: MazeImgs.three,
		start: { x: 307, y: 33 },
		victory: { x: 309, y: 162 },
		traps: {
			fire: [
				{ x: 338, y: 154 },
				{ x: 518, y: 312 },
			],
			pit: [
				{ x: 198, y: 193 },
				{ x: 418, y: 113 },
			],
			spike: [{ x: 278, y: 212 }],
		},
		spells: {
			water: [
				{ x: 120, y: 172 },
				{ x: 460, y: 33 },
				{ x: 460, y: 192 },
			],
			tp: [
				{ x: 278, y: 93 },
				{ x: 278, y: 172 },
			],
			fire: [
				{ x: 359, y: 274 },
				{ x: 336, y: 115 },
				{ x: 139, y: 233 },
			],
		},
	},
];
export function getAMaze(mazeID) {
	if (mazeID) {
		return Mazes.find(x => x.mazeID == mazeID);
	} else return Mazes[Math.floor(Math.random() * Mazes.length)];
}
