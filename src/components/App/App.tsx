import React, { useState } from 'react';
import NumberDisplay from '../number-display/number-display-component';
import './App.scss';
import { generateCells } from '../../utils/function';
import Button from '../Button/button';

const App: React.FC = () => {
    const [cells, setCells] = useState(generateCells());

    console.log('cells', cells);


    const renderCells = (): React.ReactNode => {
        return cells.map((row, rowIndex) => 
        row.map((cell, colIndex) => <Button key={`${rowIndex}-${colIndex}`} 
        state={cell.state} value={cell.value} row={rowIndex} col={colIndex}/>))
    }

    console.log("Cells", cells);

    return <div className='App'>
       <div className ='header'>
        <NumberDisplay value={0} />
        <div className ='face-container'>
            <span role='img' aria-label='face'>😊</span>
            </div>
        <NumberDisplay value={23} />
       </div>
       <div className='body'>{renderCells()}</div>
    </div>
}

export default App;
