import React from "react";
import './Missions.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch
  } from "react-router-dom";

import Story from './Story';
import Grind from './Grind';

export default function Missions(props: any){
    let [active, setActive] = React.useState(1);
    let match = useRouteMatch();
    return(
        <div className='missionContainer fadeInAnimation'>
            <Router>
                <div className='missionsNav'>
                    <Link to={`${match.url}/`} onClick={() => setActive(1)}>
                        <div className={`${active == 1 ? 'activeNav': null}`}>GRIND</div>
                    </Link>
                    <Link to={`${match.url}/story`} onClick={() => setActive(2)}>
                        <div className={`${active == 2 ? 'activeNav': null}`}>STORY</div>
                    </Link>
                </div>
                <div className='missionContent'>
                <Switch>
                    <Route exact path={`${match.url}`}>
                        <Grind data={props.GameAssetsData}/>
                    </Route>
                    <Route path={`${match.url}/story`}>
                        <Story data={props.GameAssetsData}/>
                    </Route>
                </Switch>
                </div>
            </Router>
        </div>
    );
}