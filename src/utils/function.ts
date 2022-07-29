import { MAX_COLS } from "../contants/contants";
import { MAX_ROWS } from "../contants/contants";
import { CellValue} from "../types/types";
import { CellState, Cell } from "../types/types";


export const generateCells = (): Cell[][] => {
    const cells: Cell[][] =[];

    for (let row =0; row< MAX_ROWS; row++){
        cells.push([]);
        for(let col=0; col < MAX_COLS; col++){
            cells[row].push({
                value: CellValue.none,
                state: CellState.open
            })
        }
    }

    return cells;
};