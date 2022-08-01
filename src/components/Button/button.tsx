import React from "react";
import { CellState, CellValue } from "../../types/types";
import './button.styles.scss';

interface ButtonProps {
    row: number;
    red?: boolean;
    col: number;
    state: CellState;
    value: CellValue;
    onClick(rowParam: number, colParam: number): (...args: any[]) => void;
    onContext(rowParam: number, colParam: number): (...args: any[]) => void;
}

const Button: React.FC <ButtonProps> = ({row, red, col, state, value, onClick, onContext}) =>{
    const renderContent = (): React.ReactNode => {
        if(state === CellState.visible){
            if(value === CellValue.bomb){
                return <span role='img' aria-label='bomb'>💣</span>
            }else if (value === CellValue.none){
                return null;
            }

            return value;

        } else if (state === CellState.flagged){
            return <span role='img' aria-label='flag'>🚩</span>
        }
  
    }


    return (
    <div className={`button ${
    state === CellState.visible? "visible": ""} 
    value-${value} ${red ? 'red': ''}`}
    onClick={onClick(row, col)}
    onContextMenu= {onContext(row, col)}
    >
        {renderContent()}
    </div>
    );
}


export default Button;