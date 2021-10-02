import React from 'react';
import './App.css';
import GameAssetsData from './data/gameAssets.json';
import LayoutBase from './components/layouts/LayoutBase';
import LayoutStart from './components/layouts/LayoutStart';
import LoadingLarge from './components/loading/LoadingLarge';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import { Home, Missions, Inventory, Account, PVP } from './views';

function App() {
  let [currentView, setCurrentView] = React.useState(0);
  let [accountSelected, setAccountSelected] = React.useState(undefined);
  let [loadingScreen, setLoadingScreen] = React.useState(0);

  React.useEffect(() => {
    if(accountSelected !=undefined){
      //todo: start metamask process here
      setCurrentView(1);
      showLoadingScreen();
    }
  },[accountSelected]);

  if(currentView == 0){
    return(
      <LayoutStart
        setAccountSelected={setAccountSelected}
        GameAssetsData={GameAssetsData}
      ></LayoutStart>
    )
  }
  function showLoadingScreen(){
    setLoadingScreen(1);
    setTimeout(() => setLoadingScreen(0), 2000);
  }
  return (
    
    <div className="App">
      {
        loadingScreen == 1 ? 
        <LoadingLarge/> : 
        <div className={`${loadingScreen == 1 ? null : 'fadeInAnimation'}`}>
          <LayoutBase GameAssetsData={GameAssetsData}>
            <Switch>
              <Route path="/account">
                <Account GameAssetsData={GameAssetsData}/>
              </Route>
              <Route path="/inventory">
                <Inventory GameAssetsData={GameAssetsData}/>
              </Route>
              <Route path="/missions">
                <Missions GameAssetsData={GameAssetsData}/>
              </Route>
              <Route path="/">
                <Home GameAssetsData={GameAssetsData}/>
              </Route>
            </Switch>
          </LayoutBase>
        </div>
      }
    </div>
    
  );
}

export default App;

/*
Views:
0. Welcome Screen
1. Home
2. Missions
3. Inventory
4. Stake Progress
5. Rules & FAQs
6. PVP

Layouts:
1. Base: Header, Sidemenu, Footer (Level: 1)
2. Notifications: top-left, top-right, bottom-left, bottom-right (Level: 2)
3. Center Modal: Alert, Success, Danger (Level: 2)
4. Story Mode: center-right (Level: 2)
5. Web3 Processes: (Level: 3)
*/
