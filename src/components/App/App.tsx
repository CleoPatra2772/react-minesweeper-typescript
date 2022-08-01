import React, { useEffect,useState } from 'react';
import NumberDisplay from '../number-display/number-display-component';
import './App.scss';
import { generateCells, openMultipleCells} from '../../utils/function';
import Button from '../Button/button';
import { Cell, CellState, CellValue, Face } from '../../types/types';
import { MAX_COLS, MAX_ROWS } from '../../contants/contants';
//import { setInterval } from 'timers';
// import { setInterval } from 'timers/promises';

const App: React.FC = () => {
    const [cells, setCells] = useState<Cell[][]>(generateCells());
    const [face, setFace] = useState<Face>(Face.smile);
    const [time, setTime] = useState<number>(0);
    const [live, setLive] = useState<boolean>(false);
    const [bombCounter, setBombCounter] = useState<number>(10);
    const [hasLost, setHasLost] = useState<boolean>(false);
    const [hasWon, setHasWon] = useState<boolean>(false);

    useEffect(()=>{
        const handleMousedown = (): void => {
            setFace(Face.oh);
        }
        const handleMouseup = (): void => {
            setFace(Face.smile);
        }

        window.addEventListener('mousedown', handleMousedown);
        window.addEventListener('mouseup', handleMouseup);


        return() => {
            window.removeEventListener('mousedown', handleMousedown);
            window.removeEventListener('mouseup', handleMouseup);
        }
    },[]);

    useEffect(()=>{
       if(live && time < 999){
        const timer= setInterval (() => {
            setTime(time + 1);
        }, 1000);

        return () => {
            clearInterval(timer);
        };
       }
    }, [live, time]);

    useEffect(() => {
        if(hasLost) {
            setLive(false);
            setFace(Face.lost);
        }
    }, [hasLost]);

    useEffect(() =>{
        if(hasWon) {
            setLive(false);
            setFace(Face.won);
        }
    }, [hasWon])

    const handleCellClick = (rowParam: number, colParam: number) => () :void => {
        //start the game
        
            let newCells = cells.slice();
        
            //TODO: Make sure you don't click on a bomb in the beginning.
            if(!live){
           
            let isABomb= newCells[rowParam][colParam].value === CellValue.bomb;
            while(isABomb){
                newCells = generateCells();
                if (newCells[rowParam][colParam].value === CellValue.bomb){
                    isABomb = false;
                    break;
                }
            }
        
            setLive(true);
        }  

        const currentCell = newCells[rowParam][colParam];
        

        if(
            [CellState.flagged, CellState.visible].includes(currentCell.state)){
                return;
            }

        if(currentCell.value === CellValue.bomb){
            //: take care of bomb click
            setHasLost (true);
            newCells[rowParam][colParam].red = true;
            newCells = showAllBombs();
            setCells(newCells);
            return;
        }else if (currentCell.value === CellValue.none){
            newCells = openMultipleCells(newCells, rowParam, colParam);
            //setCells(newCells);
        }else {
            newCells[rowParam][colParam].state = CellState.visible;
            //setCells(newCells);
        }
        //Check to see if you won

        let safeCellsExists = false;

        for (let row=0; row < MAX_ROWS; row++){
            for(let col =0; row < MAX_COLS; col++){
                const currentCell = newCells[row][col];

                if(currentCell.value === CellValue.bomb && currentCell.state === CellState.open){
                    safeCellsExists = true;
                    break;
                }
            }
        }

        if(!safeCellsExists){
            newCells = newCells.map(row => row.map(
                cell => {
                    if (cell.value === CellValue.bomb) {
                        return {
                            ...cell,
                            state: CellState.flagged
                        }
                    }
                    return cell;
                }
            ))
            setHasWon(true);
        }

    }

    const handleCellContext = (rowParam: number, colParam: number) => 
    (e: React.MouseEvent<HTMLDivElement, MouseEvent> ) :void => {
       e.preventDefault();

       if(!live){
        return;
       }

       const currentCells= cells.slice();
       const currentCell = cells[rowParam][colParam];

       if(currentCell.state === CellState.visible){
        return;

       }else if(currentCell.state === CellState.open){
        currentCells[rowParam][colParam].state = CellState.flagged;
        setCells(currentCells);
        setBombCounter(bombCounter -1);

       } else if(currentCell.state === CellState.flagged) {
        currentCells[rowParam][colParam].state =CellState.open;
        setCells(currentCells);
        setBombCounter(bombCounter +1);
       }

        console.log('We are in right click');
    }

    const handleFaceClick = (): void => {
        
            setLive(false);
            setTime(0);
            setCells(generateCells());
            setHasLost(false);
            setHasWon(false);
   
    };


    const renderCells = (): React.ReactNode => {
        return cells.map((row, rowIndex) => 
        row.map((cell, colIndex) => 
        <Button 
        onClick={handleCellClick}
        onContext={handleCellContext}
        key={`${rowIndex}-${colIndex}`} 
        state={cell.state} 
        value={cell.value} 
        row={rowIndex} 
        red={cell.red}
        col={colIndex}/>))
    }

    const showAllBombs = (): Cell[][] => {
        const currentCells = cells.slice();
        return currentCells.map(row => row.map(cell => {
            if(cell.value === CellValue.bomb){
                return {
                    ...cell,
                    state: CellState.visible
                }
            };
            return cell;
        }))
    }
  

    return <div className='App'>
       <div className ='header'>
        <NumberDisplay value={bombCounter} />
        <div className ='face-container' onClick={handleFaceClick}>
            <span role='img' aria-label='face'>
                {face}</span>
            </div>
        <NumberDisplay value={time} />
       </div>
       <div className='body'>{renderCells()}</div>
    </div>
}

export default App;
