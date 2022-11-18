import { Resource } from '../images';
import mazeClassic from './mazeClassic.png';
import maze2 from './maze2.png'; import maze3 from './maze3.png'
export const Mazes = {
    classic: new Resource(mazeClassic),
    two:new Resource(maze2),
    three:new Resource(maze3)
}
export default Mazes;