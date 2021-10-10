import './Header.css';
import Level from '../stats/Level';
import React from 'react';
// @ts-ignore
import NumberEasing from 'react-number-easing';

export default function Header(props:any){
    return(
        <div className='headerContainer'>
            <ul className='statsUiDisplayContainer'>
                <li className='statsUiDisplay'>
                    <div><i className="fas fa-heartbeat" style={{'color':'#C1292E'}}></i></div>
                    <div>{props.playerGameState.health} / 10</div>
                </li>
                <li className='statsUiDisplay'>
                    <div><i className="fas fa-bolt" style={{'color':'#FED766'}}></i></div>
                    <div>{props.playerGameState.energy} / 10</div>
                </li>
                <li className='statsUiDisplay'>
                    <div><i className="fas fa-dumbbell" style={{'color':'#4281A4'}}></i></div>
                    <div>{props.playerGameState.stamina} / 10</div>
                </li>
                {/*<li className='statsUiDisplay'>
                    <div><i className="fas fa-money-bill-alt" style={{'color':'#618B25'}}></i></div>
                    <div>{props.playerGameState.cash ? props.playerGameState.cash : 0}</div>
                </li>*/}
                <li className='statsUiDisplay'>
                    <div><i className="fas fa-money-bill-alt" style={{'color':'#618B25'}}></i></div>
                    <div>
                        <NumberEasing
                            value={props.playerGameState.cash}
                            speed={300}
                            decimals={2}
                            ease='quintInOut' />
                    </div>
                </li>
                <li className='statsUiDisplay'>
                    <Level 
                        currLv={props.playerGameState.level}
                        currXp={props.playerGameState.points}
                        endXp={100}
                        endLv={1}
                    />
                </li>
            </ul>
        </div>
    );
}