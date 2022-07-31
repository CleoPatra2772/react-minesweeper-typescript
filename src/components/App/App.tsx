import React, { useEffect,useState } from 'react';
import NumberDisplay from '../number-display/number-display-component';
import './App.scss';
import { generateCells } from '../../utils/function';
import Button from '../Button/button';
import { Cell, CellState, Face } from '../../types/types';
import { setInterval } from 'timers/promises';

const App: React.FC = () => {
    const [cells, setCells] = useState<Cell[][]>(generateCells());
    const [face, setFace] = useState<Face>(Face.smile);
    const [time, setTime] = useState<number>(0);
    const [live, setLive] = useState<boolean>(false);
    const [bombCounter, setBombCounter] = useState<number>(10);

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
       if(live){

        setTime(999);
    //     const timer: ReturnType<typeof setInterval> = setInterval(() => {
    //         // setTime(time + 1);
    //     }, 1000);

    //     return () => {
    //         clearInterval(timer);
    //     };
       }
    }, [live, time]);

    const handleCellClick = (rowParam: number, colParam: number) => () :void => {
        //start the game
        if(!live){
            setLive(true);
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
        if(live){
            setLive(false);
            setTime(0);
            setCells(generateCells());
        }
    }


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
        col={colIndex}/>))
    }

    console.log("Cells", cells);

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
