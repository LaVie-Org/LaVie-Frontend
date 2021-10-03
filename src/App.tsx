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

import { Home, Missions, Inventory, Account } from './views';

import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { InjectedConnector } from '@web3-react/injected-connector';
import Web3 from 'web3';
const GameContract = require('./contracts/Game.json');

const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    31337 //Mumbai
  ],
});



function App() {
  const web3React = useWeb3React();
  const web3 = new Web3(Web3.givenProvider);
  let [walletConnected, setWalletConnected] = React.useState(0);
  let [currentView, setCurrentView] = React.useState(0);
  let [accountSelected, setAccountSelected] = React.useState(undefined);
  let [gameContract, setGameContract] = React.useState<any>(undefined);
  let [loadingScreen, setLoadingScreen] = React.useState(0);
  let [chainIdCompatability, setChainIdCompatability] = React.useState<any>(0);
  let [networkChain, setNetworkChain] = React.useState(80001);
  let [newAccount, setNewAccount] = React.useState(0);

  //player account details
  let [nftId, setNftId] = React.useState(undefined);

  async function connectWallet(){
    if(!walletConnected){
      console.log('active');
      web3React.activate(injectedConnector);
    } else {
      //console.log('dactive');
      //web3React.deactivate();
      console.log('init player');
      InitPlayer();
    }
  }

  React.useEffect(() =>  {
    console.log(web3React.account);
    if(web3React.account){
      console.log('in here');
      setWalletConnected(1);
      setGameContract(new web3.eth.Contract(GameContract.abi, '0x0165878A594ca255338adfa4d48449f69242Eb8F'));
      //gameContract.methods.checkIfAddressIsAccount().then((x:any) => console.log(x));
    } else {
      setWalletConnected(0);
      setNetworkChain(0);
    }
  }, [web3React.account]);

  React.useEffect(() => {
    if(gameContract){
      InitPlayer();
    }
  }, [gameContract])

  
  React.useEffect(() => {
    if(accountSelected !=undefined){
      //todo: start metamask process here
      CreateNewPlayer(accountSelected);
      //setCurrentView(1);
      //showLoadingScreen();
    }
  },[accountSelected]);

  async function InitPlayer(){
    gameContract.methods.checkIfAddressIsAccount().call({from: web3React.account}, function(err:any, res:any){
      if(err){
        console.log("error");
        console.log(err);
      } else {
        if(res != "0"){
          //Player Exists
          console.log(`the response is: ${res}`);
          console.log('player exists');
          setNftId(res);
          setCurrentView(1);
          showLoadingScreen();
        } else {
          //New Player
          console.log('player not exists');
          setNewAccount(1);
        }
      }
    });
  }
  async function CreateNewPlayer(accountType:any){
    gameContract.methods.newPlayer(web3React.account, "a", accountType).send({
      from: web3React.account
    }, function(err:any, res:any){
      if(err){
        console.log("error");
        console.log(err);
      } else {
        if(res != "0"){
          //Player Exists
          console.log(`the response is: ${res}`);
          //console.log('player exists');
        } else {
          //New Player
          //console.log('player not exists');
        }
      }
    });
  }

  if(currentView == 0){
    return(
      <LayoutStart
        setAccountSelected={setAccountSelected}
        GameAssetsData={GameAssetsData}
        ConnectWallet={connectWallet}
        web3={web3React}
        newAccount={newAccount}
        setNewAccount={setNewAccount}
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
                <Account 
                  GameAssetsData={GameAssetsData} 
                  web3={web3React}
                  gameContract={gameContract}
                  nftId={nftId}
                />
              </Route>
              <Route path="/inventory">
                <Inventory 
                  GameAssetsData={GameAssetsData} 
                  web3={web3React}
                  gameContract={gameContract}
                  loading={showLoadingScreen}
                />
              </Route>
              <Route path="/missions">
                <Missions 
                  GameAssetsData={GameAssetsData} 
                  web3={web3React}
                  gameContract={gameContract}
                  loading={showLoadingScreen}
                />
              </Route>
              <Route path="/">
                <Home 
                  GameAssetsData={GameAssetsData}
                  web3={web3React}
                  gameContract={gameContract}
                  loading={showLoadingScreen}
                />
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
