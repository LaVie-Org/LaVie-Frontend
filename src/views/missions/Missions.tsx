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
import Button from '../../components/buttons/Button';

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
                        <Grind 
                            data={props.GameAssetsData} 
                            supabase={props.supabase}
                            userChainData={props.userChainData}
                            setUserStatistics={props.setUserStatistics}
                            userStatistics={props.userStatistics}
                            lockPlayerAccount={props.lockPlayerAccount}
                            updateStateDb={props.updateStateDb}
                            updateObjectValueArray={props.updateObjectValueArray}
                            updateNextBlockState={props.updateNextBlockState}
                            web3={props.web32}
                        />
                    </Route>
                    <Route path={`${match.url}/story`}>
                        <Story 
                            data={props.GameAssetsData} 
                            supabase={props.supabase}
                            userChainData={props.userChainData}
                            setUserStatistics={props.setUserStatistics}
                            userStatistics={props.userStatistics}
                            lockPlayerAccount={props.lockPlayerAccount}
                            updateStateDb={props.updateStateDb}
                            updateNextBlockState={props.updateNextBlockState}
                            web3={props.web32}
                        />
                    </Route>
                </Switch>
                </div>
            </Router>
            { props.lockPlayerAccount ?
            <div className='missionsLock'>
                <div className='missionsLockContainer'>
                    <div className='missionLockModal'>
                        <h2>Your Turn is Over</h2>
                        <hr></hr>
                        <p>You'll have to wait 6000 Blocks for your character to regenerate stats. Consider saving your progress to the blockchain by clicking the button below. </p>
                        <div style={{
                            display: 'flex',
                            flexDirection:'column',
                            justifyContent:'center',
                            alignItems: 'center'
                        }}>
                            <Button onClick={() => props.saveGameStateNFT()}title='Save Progress' width='150px' />
                        </div>
                        
                    </div>
                </div>
            </div> : null
            }
        </div>
    );
}