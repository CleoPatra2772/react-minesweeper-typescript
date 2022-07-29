import React from 'react';
import NumberDisplay from '../number-display/number-display-component';
import './App.scss';

const App: React.FC = () => {
    return <div className='App'>
       <div className ='header'>
        <NumberDisplay value={0} />
        <div className ='face-container'>
            <span role='img' aria-label='face'>😊</span>
            </div>
        <NumberDisplay value={23} />
       </div>
       <div className='body'>Body</div>
    </div>
}

export default App;
