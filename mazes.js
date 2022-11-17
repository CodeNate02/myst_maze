import { Background } from "./assets/images"
const Mazes = [
    {
        mazeID: 'Classic',
        screen: Background,
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
    }
]
export function getAMaze(mazeID){
    if(mazeID){
        return Mazes.find(x=>x.mazeID==mazeID);
    }
    else return Mazes[Math.floor(Math.random()*Mazes.length)]
}