import React from 'react';
import './App.css';
import GameAssetsData from './data/gameAssets.json';
import LayoutBase from './components/layouts/LayoutBase';
import LayoutStart from './components/layouts/LayoutStart';
import LoadingLarge from './components/loading/LoadingLarge';
import Billboard from './components/billboard/Billboard';
import Chat from './components/chat/Chat';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";

import { Home, Missions, Inventory, Account, Market } from './views';
import Button from './components/buttons/Button';
import {useInterval} from './utils/interval';
import {storeState} from './utils/storage';

import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { InjectedConnector } from '@web3-react/injected-connector';
import Web3 from 'web3';
import { createClient } from '@supabase/supabase-js';
import { Waku, WakuMessage } from 'js-waku';

// @ts-ignore
import protons from 'protons';
import { ethers } from "ethers";
import { parseEther } from "@ethersproject/units";
import { createRaribleSdk } from "@rarible/protocol-ethereum-sdk";
import { toAddress, toBigNumber } from "@rarible/types";
import { Web3Ethereum } from "@rarible/web3-ethereum";


const GameContract = require('./contracts/Game.json');
const DaiContract = require('./contracts/Dai.json');
const BillboardContract = require('./contracts/Billboard.json');
const LavxToken = require('./contracts/Lavx.json');
//database
const REACT_APP_SUPABASE_URL='https://gkdznaruzaydrsqslpbf.supabase.co';
const REACT_APP_SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMjc3ODU4MywiZXhwIjoxOTM4MzU0NTgzfQ.y570AzKe4nHFcbw928BAO8kv8A0js2m_Q5ixWqNY0aQ';

export const supabase = createClient(REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY);

const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    4 //Rinkeby
  ],
});

async function initWaku(setter:any, statusSetter:any){
  const w = await Waku.create({ bootstrap: true });
  setter(w);
  w.waitForConnectedPeer().then(() => {
    statusSetter('ready');
    console.log('ready')
  });
}


const proto = protons(`
message SimpleChatMessage {
  uint64 timestamp = 1;
  string text = 2;
}
`);

function App() {
  const history = useHistory();
  const web3React = useWeb3React();
  const web3 = new Web3(Web3.givenProvider);
  const [waku, setWaku] = React.useState<any>(undefined);
  const [wakuStatus, setWakuStatus] = React.useState('na');
  const [messages, setMessages] = React.useState<any>([]);
  let [showMessages, setShowMessages] = React.useState(0);
  let [walletConnected, setWalletConnected] = React.useState(0);
  let [currentView, setCurrentView] = React.useState(0);
  let [accountSelected, setAccountSelected] = React.useState(undefined);
  let [platformSelected, setPlatform] = React.useState(1);
  let [gameContract, setGameContract] = React.useState<any>(undefined);
  let [daiContract, setDaiContract] = React.useState<any>(undefined);
  let [lavxtoken, setLavxtokenContract] = React.useState<any>(undefined);
  let [billboardContract, setBillboardContract] = React.useState<any>(undefined);
  let [billboard, setBillboard] = React.useState('');
  let [showBillboard, setShowBillboard] = React.useState(0);
  let [loadingScreen, setLoadingScreen] = React.useState(0);
  let [chainIdCompatability, setChainIdCompatability] = React.useState<any>(0);
  let [networkChain, setNetworkChain] = React.useState(80001);
  let [newAccount, setNewAccount] = React.useState(0);
  let [loadingMessage, setLoadingMessage] = React.useState<string>('');
  
  const itemsContractAddress =  '0x37648D0EBD005e850Abf8B19E8a13851A8C33DDA';
  const stakeManager = '0xE23aC4DE86D3e87601b90aDE17c53c83a78f9114';
  const accountsContractAddress = '0xe54b633140D829e69dB8a0c74d71F207E2efC850';
  const gameContractAddress = '0xEA4C2425408312761f6b169Ca2CBa951e20Fc128';
  const billboardAddress = '0x911b5Dfd510593dcBB8e3f4F3EDe3427D59bcb8C';
  const daiContractAddress = '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa';
  const lavxAddress = '0x71b4f145617410ee50dc26d224d202e9278d71f1'
  
  let [sdk, setSDK] = React.useState<any>(undefined);
  let [saveProgress, setSaveProgress] = React.useState(0);
  let [currBlockNumber, setCurrBlockNumber] = React.useState<any>(undefined);

      //player account details
  let [userChainData, setUserChainData] = React.useState({
        'userAddress': undefined,
        'userNFTId': undefined,
        'userGameItems': undefined
  });
  
  let [userStatistics, setUserStatistics] = React.useState({
      "health":10,
      "energy":10,
      "stamina":10,
      "cash":0,
      "points":0,
      "xp":0,
      "level":1,
      "grind_missions": 0,
      "grind_rac":0,
      "grind_kd":0,
      "next_block": 0,
      "playables": [1,1,1,1,1,1,1,1,1],
      "flow": 0
  });
  
  let [lockPlayerAccount, setLockPlayerAccount] = React.useState(0);
  let [readyPlayerOne, setReadyPlayerOne] = React.useState(0);
  let [updateNextBlock, setUpdateNextBlock] = React.useState(0);
  let [lavxWalletBal, setLavxWalletBal] = React.useState(0);

  async function GetCurrentBlock(){
    await web3.eth.getBlockNumber().then((x:any) => {console.log(x); setCurrBlockNumber(x)});
  }

  useInterval(async () => GetCurrentBlock(), 3000);

  React.useEffect(() => {
    GetCurrentBlock();
  },[]);

  React.useEffect(() => {
    console.log(currBlockNumber);
    console.log(userStatistics.next_block <= currBlockNumber);
    unlockAndRegenaratePlayerAccount();
  }, [currBlockNumber])

  function unlockAndRegenaratePlayerAccount(){
    if(lockPlayerAccount || userStatistics.next_block <= currBlockNumber){
      let refreshedObj = {
        ...userStatistics,
        ['health']: 10,
        ['energy']: 10,
      }
      setUserStatistics(refreshedObj);
      updateStateDb(refreshedObj);
      setLockPlayerAccount(0);
    }
  }
  React.useEffect(() => {
    if(userStatistics.points/100 == 1){
      let v = userStatistics['level'];
      let oldPoints = userStatistics['points']

      let objectvalue = {
        ...userStatistics,
        ['level']: v + 1,
        ['xp']: oldPoints + userStatistics.points,
        ['points']: 0
      };
      setUserStatistics(objectvalue);
      updateStateDb(objectvalue);
      console.log(objectvalue);
    }
  }, [userStatistics.points]);

  React.useEffect(() => {
    if(
      userStatistics.health == 0 &&
      userStatistics.energy == 0 ||
      userStatistics.playables.length == 0
    ) {
      setLockPlayerAccount(1);
      GetCurrentBlock();
    } else {
      setLockPlayerAccount(0);
    }
  },[userStatistics]);

  React.useEffect(() => {
    if(lockPlayerAccount && readyPlayerOne && !updateNextBlock){
      updateNextBlockState();
    }
  }, [lockPlayerAccount, readyPlayerOne])

  useInterval(async () => startFlowingInGameLav(0.02314814815), userStatistics.flow);

  async function updateNextBlockState(){
    let nextBlock = await web3.eth.getBlockNumber().then((x:any) => x + 1);
    let obj = await replaceObjectValue('next_block', nextBlock, userStatistics);
    setUserStatistics(obj);
    updateStateDb(obj);
    setUpdateNextBlock(1);
    console.log(obj)
  }
  async function replaceObjectValue(key:any, value:any, obj:any){
    // Destructure current state object
    let v = obj[key];
    let objectvalue = {
      ...obj,
      [key]: value,
    };
    
    return objectvalue;
  };
  async function updateObjectValue(key:any, value:any, obj:any){
      // Destructure current state object
      let v = obj[key];
      let objectvalue = {
        ...obj,
        [key]: v - value,
      };
      
      return objectvalue;
  };
  async function updateObjectValueArray(key:any, obj:any, type:any){
    // Destructure current state object
    let objectvalue;
    let v = obj[key];
    if(type){
      v.push(1)
      objectvalue = {
        ...obj,
        [key]: v,
      };
    } else {
      v.pop()
      objectvalue = {
        ...obj,
        [key]: v,
      };
    }

    
    return objectvalue;
  };
  React.useEffect(() => {
    initWaku(setWaku, setWakuStatus)
    .then(() => {
      console.log('waku ready');
    })
    .catch((e) => console.log('Waku init failed ', e));
  }, []);

  const processIncomingMessage = React.useCallback((wakuMessage) => {
    // Empty message?
    if (!wakuMessage.payload) return;
  
    // Decode the protobuf payload
    const { timestamp, text } = proto.SimpleChatMessage.decode(
      wakuMessage.payload
    );
    const time = new Date();
    time.setTime(timestamp);
    const message = { text, timestamp: time, to: 'in' };
  
    // For now, just log new messages on the console
    setMessages((currMessages:any) => {
      return [message].concat(currMessages);
    });
  }, []);

  React.useEffect(() => {
    if (wakuStatus == 'ready'){
      console.log('ddddd')
    // Pass the content topic to only process messages related to your dApp
    waku.relay.addObserver(processIncomingMessage, ["/lavie/1/gang-chatter/proto"]);
    console.log(waku.relay)
    // `cleanUp` is called when the component is unmounted, see ReactJS doc.
    return function cleanUp() {
      waku.relay.deleteObserver(processIncomingMessage, ["/lavie/1/gang-chatter/proto"]);
    };
  }
  }, [wakuStatus]);

  function wakuSendMessage(message:any, timestamp:any, waku:any) {
    const time = timestamp.getTime();
  
    // Encode to protobuf
    const payload = proto.SimpleChatMessage.encode({
      timestamp: time,
      text: message
    });
  
    // Wrap in a Waku Message
    return WakuMessage.fromBytes(payload, "/lavie/1/gang-chatter/proto").then((wakuMessage) => 
      waku.relay.send(wakuMessage)
    );
  }

  async function SellAccountRarible(nftId:any){
    // Sell request example:
    const contractErc20Address = toAddress(daiContractAddress); // your ERC20 contract address
    const contractErc721Address = toAddress(accountsContractAddress); // your ERC721 contract address
    const tokenId =  toBigNumber(nftId); // the ERC721 Id of the token on which we want to place a bid
    const sellerAddress = web3React.account // Owner of ERC721 token
    const nftAmount = 2 // For ERC721 always be 1
    const sellPrice = toBigNumber('20'); // price per unit of ERC721 or ERC1155 token(s)
    //0000000000000000000000000000000000000000000000000000000000000001
    const request = {
        makeAssetType: {
            assetClass: "ERC721",
            contract: contractErc721Address,
            tokenId: tokenId,
        },
        maker: sellerAddress,
        amount: nftAmount,
        originFees: [],
        payouts: [],
        price: sellPrice,
        takeAssetType: {
            assetClass: "ERC20",
            contract: contractErc20Address
        },
    }
    console.log(request);
    const order = await sdk.order.sell(request);
    console.log(order);
  }

  async function SellItemRarible(id:any){
    // Sell request example:
    const contractErc20Address = toAddress(daiContractAddress); // your ERC20 contract address
    const contractErc1155Address = toAddress(itemsContractAddress); // your ERC721 contract address
    const tokenId =  toBigNumber(id); // the ERC721 Id of the token on which we want to place a bid
    const sellerAddress = web3React.account // Owner of ERC721 token
    const nftAmount = 2 // For ERC721 always be 1
    const sellPrice = toBigNumber('20'); // price per unit of ERC721 or ERC1155 token(s)
    //0000000000000000000000000000000000000000000000000000000000000001
    const request = {
        makeAssetType: {
            assetClass: "ERC1155",
            contract: contractErc1155Address,
            tokenId: tokenId,
        },
        maker: sellerAddress,
        amount: nftAmount,
        originFees: [],
        payouts: [],
        price: sellPrice,
        takeAssetType: {
            assetClass: "ERC20",
            contract: contractErc20Address
        },
    }
    console.log(request);
    const order = await sdk.order.sell(request);
    console.log(order);
  }


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
    if(web3React.account){
      console.log('in here');
      setWalletConnected(1);
      setGameContract(new web3.eth.Contract(GameContract.abi, gameContractAddress));
      setDaiContract(new web3.eth.Contract(DaiContract, daiContractAddress));
      setBillboardContract(new web3.eth.Contract(BillboardContract.abi, billboardAddress));
      setLavxtokenContract(new web3.eth.Contract(LavxToken.abi, lavxAddress));
      const raribleSdk = createRaribleSdk(new Web3Ethereum({ web3 }), 'rinkeby');
      setSDK(raribleSdk);
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
      ApproveAndCreate(accountSelected);
      //setCurrentView(1);
      //showLoadingScreen();
    }
  },[accountSelected]);

  async function InitPlayer(){
    history.push('/');
    setLoadingMessage('La Vie is loading . . .');
    gameContract.methods.getPlayerData().call({from: web3React.account, none: 0}, async function(err:any, res:any){
      if(err){
        console.log("error");
        console.log(err);
      } else {
        if(res[1] != "0"){
          //Player Exists
          setCurrentView(1);
          showLoadingScreen();
          console.log(`the response is: ${res}`);
          console.log('player exists');
          fillUserObject(res);
          //setCurrentView(1);
          //showLoadingScreen();
          LoadBillBoard();          
          let p:any = await checkPlayerStateDb();
          if(p.length == 0){
            console.log('player not found in db');
            initStateDb(userStatistics);
            setReadyPlayerOne(1);
          } else {
            console.log(p);
            setUserStatistics(p[0].player_stat);
            setReadyPlayerOne(1);
          }
          setTimeout(() => setLoadingScreen(0), 2000);
        } else {
          //New Player
          console.log('player not exists');
          setNewAccount(1);
        }
      }
    });
  }

  async function ApproveAndCreate(accountType:any){
    setCurrentView(1);
    setLoadingScreen(1);
    let amt = web3.utils.toWei('0');

    if(accountType == 3) {
      amt = web3.utils.toWei('200');
    } else if(accountType == 2){
      amt = web3.utils.toWei('100');
    } else {

    }

    if(accountType != 1){
      ApproveGameDai(amt).then((res:any) => {
        if(res){
          CreateNewPlayer(accountType, amt, platformSelected);
        } else {
          console.log('ERROR APPROVING');
          setCurrentView(0);
          setLoadingScreen(0);
        }
      });
    } else {
      CreateNewPlayer(accountType, amt, 0); 
    }
  }

  async function ApproveGameDai(approveAmount:any){
    setLoadingMessage('Approving Game Stake Manager . . . ');
    const daiApprove = function(resolve:any,reject:any) {
      daiContract.methods.approve(stakeManager, approveAmount).send({from:web3React.account}, function(err:any, res:any){
        if(err){
          console.log("ERROR");
          console.log(err);
          reject(0);
        } else {
          resolve(1);
        }
      });
    }
    return new Promise(daiApprove);
  }

  async function ApproveLavx(approveAmount:any){
    setLoadingMessage('Approving Lavx . . . ');
    const LavxApprove = function(resolve:any,reject:any) {
      lavxtoken.methods.approve(stakeManager, approveAmount).send({from:web3React.account}, function(err:any, res:any){
        if(err){
          console.log("ERROR");
          console.log(err);
          reject(0);
        } else {
          resolve(1);
        }
      });
    }
    return new Promise(LavxApprove);
  }

  async function CreateNewPlayer(accountType:any, amount:any, stakeType:any){
    setLoadingMessage('Staking Funds are being transferred . . .');
    gameContract.methods.newPlayer(web3React.account, "a", accountType, amount, stakeType).send({'from': web3React.account}, async function(err:any, res:any){
        if(err){
          console.log("error");
          console.log(err);
          setCurrentView(0);
          setLoadingScreen(0);
        } else {
          if(res != "0"){
            //Player Exists
            console.log(`the response is: ${res}`);
            console.log(res);
            await web3.eth.getTransaction(res).then((x:any) => console.log(x));
            //console.log('player exists');
            startLavxFlow();
            initPlayerLoading();
          //setCurrentView(1);
          //showLoadingScreen();
          //history.push('/');
          } else {
            //New Player
            //console.log('player not exists');
          }
        }
      }
    );
  }

  async function DeleteAccount(nftId:any){
    let res = await gameContract.methods.deletePlayer(web3React.account, nftId).call({from: web3React.account}, async function(err:any, res:any){
      if(err){
        console.log(err);
      } else {
        return res;
      }
    });
    return res;
  }

  async function LoadBillBoard(){
    billboardContract.methods.tokenURI(1).call({}, async function(err:any, res:any){
      if(err){
        console.log(err);
      } else {
        const base64 = await fetch(res);
        const blob = await base64.blob();
        let x = await blob.text();
        setBillboard(JSON.parse(x)['image']);
      }
    })
  }

  async function GetStakeDuration(){
    let res = await gameContract.methods.getMaturation(web3React.account).call({from: web3React.account}, async function(err:any, res:any){
      if(err){
        console.log(err);
      } else {
        return res;
      }
    });
    return res;
  }
  async function GetStakeAmount(){
    let res = await gameContract.methods.getStakedAmount(web3React.account).call({from: web3React.account}, async function(err:any, res:any){
      if(err){
        console.log(err);
      } else {
        return res;
      }
    });
    return res;
  }
  async function GetStakeFlag(){
    let res = await gameContract.methods.isStakingBool(web3React.account).call({from: web3React.account}, async function(err:any, res:any){
      if(err){
        console.log(err);
      } else {
        return res;
      }
    });
    return res;
  }
  async function GetLavxBalance(){
    let lavxRes = await lavxtoken.methods.balanceOf(web3React.account).call({}, function(err:any, res:any){
      if(err){
        console.log("balance of error");
      } else {
        setLavxWalletBal(res / 1000000000000000000);
      }
    });
    return lavxRes;
  }

  async function ClaimRewardFromContract(){
    ApproveLavx(parseEther('2000')).then((res:any) => {
      if(res){
        gameContract.methods.playerReceivesRandomItemFromCrate(web3React.account, userChainData.userNFTId)
        .send({from: web3React.account}, function(err:any, res:any){
          if(err){
            console.log('error');
          } else {
            console.log(res);
            return res;
          }
        });
      } else {
        console.log('error claimewardfromcontract')
      }
    })
  }
  async function saveToNft(newTokenURI:any){
    gameContract.methods.updatePlayerState(
      web3React.account,
      userChainData.userNFTId,
      newTokenURI,
      parseEther(userStatistics.cash.toString())
    ).send({from:web3React.account}, function(err:any, res:any){
      if(err){
        console.log('errror saving nft');
      } else {
        setSaveProgress(0);
      }
    })
  }
  async function updateBillboard(first_line:any, second_line:any, third_line:any, amount:any){
    ApproveLavx(parseEther(amount.toString())).then((res:any) => {
      if(res){
        billboardContract.methods.updateLaVieBoard(
          first_line,
          second_line,
          third_line,
          parseEther(amount.toString())
        ).send({from: web3React.account}, function(err:any, res:any){
          if(err){
            console.log('error updating board');
          } else {
            LoadBillBoard();
            console.log('boardUpdated');
          }
        });
      } else {
        console.log('error claimewardfromcontract')
      }
    })
  }
  async function getCurrentBillboardPrice(cb:any){
    billboardContract.methods.getCurrentPrice().call({}, function(err:any, res:any){
      if(err){
        console.log(err);
      } else {
        cb(res / 1000000000000000000);
      }
    })
  }
  //helperFunctions
  async function startFlowingInGameLav(val:any){
    let x = await updateObjectValue("cash", -val, userStatistics);
    setUserStatistics(x);
  }
  function showLoadingScreen(){
    setLoadingScreen(1);
    setTimeout(() => setLoadingScreen(0), 2000);
  }
  function fillUserObject(x:any){
    let obj = {
      'userAddress': x[0],
      'userNFTId': x[1],
      'userGameItems': x[2]
    }
    setUserChainData(obj);
  }
  async function initPlayerLoading(){
    await setTimeout(() => InitPlayer(), 10000);
  }
  function sendMessage(messageToSend:any){
    if (wakuStatus !== 'ready') return;
    let time = new Date();
      wakuSendMessage(messageToSend, time, waku).then(() => setMessages((currMessages:any) => {
        let message = { text: messageToSend, timestamp: new Date(), to:'out' };
        return [message].concat(currMessages);
      }));
  }
  async function initStateDb(val:any){
    console.log('INIT STATE DB');
    if(web3React.account){
      const { data, error } = await supabase
      .from('data_dump')
      .insert([
        { address: web3React.account, player_stat: val },
      ]);
      if(error){
        console.log(error);
      } else {
        console.log(data);
      }
    }
  };
  async function updateStateDb(val:any){
    setReadyPlayerOne(0);
    console.log('UPDATE STATE DB');
    if(web3React.account){
      const { data, error } = await supabase
      .from('data_dump')
      .update({ 'player_stat': val })
      .eq('address', web3React.account);

      if(error){
        //console.log(error);
      } else {
        console.log(data);
      }
    }
    setReadyPlayerOne(1);
  };
  async function checkPlayerStateDb(){
    if(web3React.account){
      const { data, error } = await supabase
      .from('data_dump')
      .select("*")
      .eq('address', web3React.account);
      if(error){
        console.log(error);
      } else {
        return data;
      }
    }
  };
  function startLavxFlow(){
    //storeState(web3);
    fetch("https://lavie-superfluid.herokuapp.com/start", {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        "address": web3React.account,
        "flow_type": 1
      })
    })
    .then(async response =>  {
      if(response.statusText == 'OK'){
        let y = await replaceObjectValue("flow", 1000, userStatistics);
        setUserStatistics(y);
      }
    })
    .catch(err => {
      console.error(err);
    });
  }
  function stopLavxFlow(){
    //storeState(web3);
    fetch("https://lavie-superfluid.herokuapp.com/end", {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        "address": web3React.account
      })
    })
    .then(async response => {
      if(response.statusText == "OK"){
        let y = await replaceObjectValue("flow", null, userStatistics);
        setUserStatistics(y);
      }
    })
    .catch(err => {
      console.error(err);
    });
  }
  async function saveGameStateNFT(){
    let cid:any = await storeState(web3);
    let keys = Object.keys(cid);
    await saveToNft(cid[keys[0]]);
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
        setPlatform={setPlatform}
      >
      </LayoutStart>
    )
  }
  return (
    <div className="App">
      {
        
        loadingScreen == 1 ? 
        <LoadingLarge message={loadingMessage} /> : 
        
        <div className={`${loadingScreen == 1 ? null : 'fadeInAnimation'}`}>
          <LayoutBase GameAssetsData={GameAssetsData} playerGameState={userStatistics} setSaveProgress={setSaveProgress}>
          
            <Switch>
              <Route path="/account">
                <Account 
                  GameAssetsData={GameAssetsData} 
                  web3={web3React}
                  web32={web3}
                  gameContract={gameContract}
                  loading={showLoadingScreen}
                  userChainData={userChainData}
                  SellAccountRarible={SellAccountRarible}
                  GetStakeDuration={GetStakeDuration}
                  GetStakeAmount={GetStakeAmount}
                  GetStakeFlag={GetStakeFlag}
                  DeleteAccount={DeleteAccount}
                  currBlockNumber={currBlockNumber}
                />
              </Route>
              <Route path="/inventory">
                <Inventory 
                  GameAssetsData={GameAssetsData} 
                  web3={web3React}
                  gameContract={gameContract}
                  loading={showLoadingScreen}
                  userChainData={userChainData}
                  SellItemRarible={SellItemRarible}
                />
              </Route>
              <Route path="/market">
                <Market 
                  GameAssetsData={GameAssetsData} 
                  web3={web3React}
                  gameContract={gameContract}
                  loading={showLoadingScreen}
                  supabase={supabase}
                  userStatistics={userStatistics}
                  ClaimRewardFromContract={ClaimRewardFromContract}
                  GetLavxBalance={GetLavxBalance}
                  lavxWalletBal={lavxWalletBal}
                />
              </Route>
              <Route path="/missions">
                <Missions 
                  GameAssetsData={GameAssetsData} 
                  web3={web3React}
                  web32={web3}
                  gameContract={gameContract}
                  loading={showLoadingScreen}
                  supabase={supabase}
                  userChainData={userChainData}
                  userStatistics={userStatistics}
                  setUserStatistics={setUserStatistics}
                  lockPlayerAccount={lockPlayerAccount}
                  updateStateDb={updateStateDb}
                  updateObjectValueArray={updateObjectValueArray}
                  updateNextBlockState={updateNextBlockState}
                  saveGameStateNFT={saveGameStateNFT}
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
            { showBillboard ? 
              <Billboard 
                billboard={billboard} 
                exitBillboard={()=> setShowBillboard(showBillboard ? 0 : 1)}
                updateBillboard={updateBillboard}
                getCurrentBillboardPrice={getCurrentBillboardPrice}
              />
            : null}
            { showMessages ? 
              <Chat 
                messages={messages} 
                hideChat={()=> setShowMessages(showMessages ? 0 : 1)}
                sendMessage={sendMessage}
                disabled={wakuStatus !== 'ready'}
                />
            : null}
            <div className='billboardIndicator'>
              <label onClick={() => setShowBillboard(1)}>HITLIST</label>
            </div>
            <div className='ChatterBox'>
              <div onClick={() => setShowMessages(1)}>
                <i className="far fa-comment-dots"></i>
                <label>RAT BOX</label>
              </div>
            </div>
          </LayoutBase>
          {saveProgress ?
          <div className='smallModalSave'>
            <div className='smModalContainer'>
              <h2>Save Progress</h2>
              <hr></hr>
              <p>You're about to save your progress to the blockchain. Click the button below to continue.</p>
              <Button title='CHAIN IT!' onClick={() => saveGameStateNFT()}/>
              <span><i className="fas fa-times" onClick={() => setSaveProgress(0)}></i></span>
            </div>
          </div> : null}  
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
