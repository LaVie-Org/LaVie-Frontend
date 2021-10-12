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
import { BigNumber, toAddress, toBigNumber } from "@rarible/types";
import { Web3Ethereum } from "@rarible/web3-ethereum";

import {
  itemsContractAddress,
  stakeManager,
  accountsContractAddress,
  gameContractAddress,
  billboardAddress,
  daiContractAddress,
  lavxAddress
} from './utils/addressLibrary';

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
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
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
 
  let [chainIdCompatability, setChainIdCompatability] = React.useState<any>(0);
  let [networkChain, setNetworkChain] = React.useState(80001);
  let [newAccount, setNewAccount] = React.useState(0);
  let [itemsForSale, setItemsForSale] = React.useState<any>([]);
  let [loadingScreen, setLoadingScreen] = React.useState(0);
  let [loadingMessage, setLoadingMessage] = React.useState<string>('');
  let [CURRENT_TXN, SET_CURRENT_TXN] = React.useState(0);
  let [MAX_TXN, SET_MAX_TXN] = React.useState(0);
  let [ERROR, SET_ERROR] = React.useState(0);
  
  /*const itemsContractAddress =  '0x37648D0EBD005e850Abf8B19E8a13851A8C33DDA';
  const stakeManager = '0xE23aC4DE86D3e87601b90aDE17c53c83a78f9114';
  const accountsContractAddress = '0xe54b633140D829e69dB8a0c74d71F207E2efC850';
  const gameContractAddress = '0xEA4C2425408312761f6b169Ca2CBa951e20Fc128';
  const billboardAddress = '0x911b5Dfd510593dcBB8e3f4F3EDe3427D59bcb8C';
  const daiContractAddress = '0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa';
  const lavxAddress = '0x71b4f145617410ee50dc26d224d202e9278d71f1'*/
  
  let [sdk, setSDK] = React.useState<any>(undefined);
  let [saveProgress, setSaveProgress] = React.useState(0);
  let [currBlockNumber, setCurrBlockNumber] = React.useState<any>(undefined);

      //player account details
  let [userChainData, setUserChainData] = React.useState<any>(undefined);
  
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
      "flow": 0,
      "flow_amt":0
  });
  
  let [lockPlayerAccount, setLockPlayerAccount] = React.useState(0);
  let [readyPlayerOne, setReadyPlayerOne] = React.useState(0);
  let [updateNextBlock, setUpdateNextBlock] = React.useState(0);
  let [lavxWalletBal, setLavxWalletBal] = React.useState(0);

  async function GetCurrentBlock(){
    await web3.eth.getBlockNumber().then((x:any) => {console.log(x); setCurrBlockNumber(x)});
  }

  useInterval(async () => GetCurrentBlock(), readyPlayerOne ? 3000 : null);

  React.useEffect(() => {
    GetCurrentBlock();
  },[]);

  React.useEffect(() => {
    if(loadingScreen == 0){
      SET_ERROR(0);
      SET_CURRENT_TXN(0);
      SET_MAX_TXN(0);
      setLoadingMessage('');
    }
  }, [loadingScreen]);

  React.useEffect(() => {
    if(readyPlayerOne){
      console.log(currBlockNumber);
      console.log(userStatistics.next_block <= currBlockNumber);
      unlockAndRegenaratePlayerAccount();
    }
  }, [currBlockNumber])

  function unlockAndRegenaratePlayerAccount(){
    if(readyPlayerOne){
    if(lockPlayerAccount || userStatistics.next_block <= currBlockNumber){
      let refreshedObj = {
        ...userStatistics,
        ['health']: 10,
        ['energy']: 10,
      }
      setUserStatistics(refreshedObj);
      updateStateDb(refreshedObj);
      setLockPlayerAccount(0);
    }}
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


  useInterval(async () => startFlowingInGameLav(0.02314814815), userStatistics.flow == 1000 ? userStatistics.flow : null );

  async function updateNextBlockState(){
    let nextBlock = await web3.eth.getBlockNumber().then((x:any) => x + 1);
    let obj = await replaceObjectValue('next_block', nextBlock, userStatistics);
    setUserStatistics(obj);
    updateStateDb(obj);
    setUpdateNextBlock(1);
    console.log(obj)
  }

  React.useEffect(() => {
    initWaku(setWaku, setWakuStatus)
    .then(() => {
      //console.log('waku ready');
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
    // Pass the content topic to only process messages related to your dApp
    waku.relay.addObserver(processIncomingMessage, ["/lavie/1/gang-chatter/proto"]);
    //console.log(waku.relay)
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
    setLoadingMessage('Placing a SELL order on Rarible . . .')
    setLoadingScreen(1);
    let order;
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
    try {
      order = await sdk.order.sell(request);
    } catch(err) {
      SET_ERROR(1);
      console.log('error');
    }
    if(order){
      console.log(order);
      setLoadingScreen(0);
    }
  }

  async function SellItemRarible(id:any){
    // Sell request example:
    setLoadingMessage('Placing a SELL order on Rarible . . .')
    setLoadingScreen(1);
    let order;
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
    try {
      order = await sdk.order.sell(request);
    } catch(err) {
      console.log(err);
      SET_ERROR(1);
    }
    if(order){
      console.log(order);
      // @ts-ignore
      setItemsForSale(itemsForSale => {console.log([...itemsForSale, id]); return [...itemsForSale, id] });
      history.push('/inventory');
      setLoadingScreen(0);
    }

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
      setGameContract(new ethers.Contract(gameContractAddress, GameContract.abi, signer));
      setDaiContract(new ethers.Contract(daiContractAddress, DaiContract, signer));
      setBillboardContract(new ethers.Contract(billboardAddress, BillboardContract.abi, signer));
      setLavxtokenContract(new ethers.Contract(lavxAddress, LavxToken.abi, signer));
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

  // *********************************************************** //
  // ******************* Calling Contracts  ******************** //
  // *********************************************************** //

  async function ApproveGameDai(approveAmount:string){
    setLoadingMessage("We're requesting access to your Dai holdings. . . ");
    let daiRes; 
    try {
      let daiApprove = await daiContract.approve(stakeManager, approveAmount);
      daiRes = await daiApprove.wait();
    } catch(err){
      SET_ERROR(1);
      console.log(err);
    }
    if(daiRes && daiRes != 0){
      return daiRes;
    }
  }
  async function ApproveLavx(spender:any, approveAmount:ethers.BigNumber){
    setLoadingMessage("We're requesting access to your LavX holdings. . . ");
    let approveReceipt;
    try {
      let approve = await lavxtoken.approve(spender, approveAmount);
      approveReceipt = await approve.wait();
    } catch(err){
      SET_ERROR(1);
      console.log(err);
    }
    if(approveReceipt && approveReceipt != 0){
      return approveReceipt;
    }
  }
  async function SendLavxPayment(amount:any){
    setLoadingMessage("Transfering LavX . . . ");
    let receipt;
    try{
      let response = await lavxtoken.transferFrom(web3React.account, stakeManager, amount);
      receipt = await response.wait();
    } catch(err) {
      SET_ERROR(1);
    }
    if(receipt && receipt !=0){
      return receipt;
    }
  }
  async function getPlayerOnChainData(){
    setLoadingMessage("Accessing Player Data . . . ");
    let txn = await gameContract.getPlayerData();
    return txn;
  };
  async function InitPlayer(){
    history.push('/');
    setLoadingMessage('La Vie is loading . . .');
    let res = await getPlayerOnChainData();
    if(res[1] != "0"){
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
      console.log('player not exists');
      setNewAccount(1);
    }
  }
  async function ApproveAndCreate(accountType:any){

    let amt = web3.utils.toWei('0');

    if(accountType == 3) {
      amt = web3.utils.toWei('200');
    } else if(accountType == 2){
      amt = web3.utils.toWei('100');
    } else {

    }
    setCurrentView(1);
    setLoadingScreen(1);
    if(accountType != 1){
      SET_MAX_TXN(2);
      SET_CURRENT_TXN(1);
      let daiApproval = await ApproveGameDai(amt);
      if(daiApproval){
        SET_CURRENT_TXN(2);
        _NewPlayer(accountType, amt, platformSelected);
      }
    } else {
      _NewPlayer(accountType, amt, 0); 
    }
  }
  async function _NewPlayer(accountType:any, amount:any, stakeType:any){
    setLoadingMessage('Creating a new Player Account . . .');
    let res;
    try {
    let newPlayerRes = await GameContract.newPlayer(
      web3React.account,
      'ipfs://bafkreiauyyyqdtvh7hp6f5o7di43u537vjkqiuptfpjz7h2t3aqaekz74u',
      accountType,
      amount,
      stakeType
    );
      res = await newPlayerRes.wait();
    } catch(err){
      SET_ERROR(1);
      console.log(err);
    }

    if(res && res != 0){
      startLavxFlow();
      initPlayerLoading();
    } else {
      SET_ERROR(1);
    }
  }
  async function DeleteAccount(nftId:any){
    setLoadingMessage('Creating a new Player Account . . .');
    setLoadingScreen(1);
    let delRes;
    try {
      let res = await gameContract.deletePlayer(web3React.account, nftId);
      delRes = await res.wait();
    } catch(err){
      SET_ERROR(1);
      console.log(err);
    }
    if(delRes && delRes !=0){
      window.location.reload();
    }
  }
  async function LoadBillBoard(){
    let bbRes = await billboardContract.tokenURI(1);
    //let bbRec = await bbRes.wait();
    if(bbRes){
      const base64 = await fetch(bbRes);
      const blob = await base64.blob();
      let x = await blob.text();
      setBillboard(JSON.parse(x)['image']);
    }

  }
  async function GetStakeDuration(){
    let stakeDuration = await gameContract.getMaturation(web3React.account);
    if(stakeDuration){
      return stakeDuration;
    } else {
      console.log('error retrieving duration');
      return 0;
    }
  }
  async function GetStakeAmount(){
    let stakeAmount = await gameContract.getStakedAmount(web3React.account);
    if(stakeAmount){
      return stakeAmount;
    } else {
      console.log('error retrieving amount');
      return 0;
    }
  }
  async function GetStakeFlag(){
    let stakeFlag = await gameContract.isStakingBool(web3React.account);
    if(stakeFlag){
      return stakeFlag;
    } else {
      console.log('error retrieving amount');
      return 0;
    }
  }
  async function GetLavxBalance(){
    try {
      let lavxRes = await lavxtoken.balanceOf(web3React.account);
      if(lavxRes){
        lavxRes = parseInt(ethers.utils.formatEther(lavxRes.toString()));
        setLavxWalletBal(lavxRes);
        return lavxRes;
      } else {
        console.log('error getting balance.');
      }
    } catch(err) {
      console.log(err);
    }
  }
  /*async function ClaimRewardFromContract(){
    ApproveLavx(gameContractAddress, parseEther('2000')).then((res:any) => {
      if(res){
        gameContract.methods.playerReceivesRandomItemFromCrate(web3React.account, userChainData.userNFTId)
        .send({from: web3React.account, gasLimit: 21000}, function(err:any, res:any){
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
  }*/
  async function saveToNft(newTokenURI:any){
    setLoadingMessage('Saving data as NFT to your wallet . . .');
    let saveRes;
    try {
      let saveNft = await gameContract.updatePlayerState(
        web3React.account,
        userChainData.userNFTId,
        "ipfs://" + newTokenURI.toString(),
        parseEther(userStatistics.cash.toString())
      );
      saveRes = await saveNft.wait();
    } catch(error){
      SET_ERROR(1);
      console.log('saving nft txn failed.')
    }
    if(saveRes && saveRes !=0){
      let y = await replaceObjectValue("cash", 0, userStatistics);
      updateStateDb(y);
      setUserStatistics(y);
      setSaveProgress(0);
      setLoadingScreen(0);
    } else {
      SET_ERROR(1);
      console.log('Save Failed.');
    }
  }
  async function approveAndUpdateBillboard(first_line:any, second_line:any, third_line:any, amount:any){
    SET_MAX_TXN(2);
    SET_CURRENT_TXN(1);
    setLoadingScreen(1);
    
    let amt = parseEther(amount.toString());
    let aRes = await ApproveLavx(billboardAddress, amt);
    if(aRes){
      setLoadingMessage('Billboard is being updated. Please wait . . .');
      SET_CURRENT_TXN(2);
      await updateBillboard(first_line, second_line, third_line, amt);
    }
  }
  async function updateBillboard(first_line:any, second_line:any, third_line:any, amount:any){
    let bbRes;
    try {
      let billboardRes = await billboardContract.updateLaVieBoard(
            first_line,
            second_line,
            third_line,
            amount
        );
      bbRes = await billboardRes.wait();
    } catch(err){
      SET_ERROR(1);
      console.log(err);
    }
    if(bbRes && bbRes != 0){
      LoadBillBoard();
      setLoadingScreen(0);
    } else {
      SET_ERROR(1);
    }
  }
  async function getCurrentBillboardPrice(cb:any){
    let res = await billboardContract.getCurrentPrice();
    //let bbRec = await bbRes.wait();
    if(res){
      cb(ethers.utils.formatEther(res.toString()));
    };
  }
  async function _playerReceivesAnItem(item_id:any){
    setLoadingMessage('Transferring the Item to your account . . .');
    let res;
    try {
    let pItem = await gameContract.playerReceivesAnItem(
      web3React.account,
      userChainData.userNFTId,
      item_id
    );
      res = await pItem.wait();
    } catch(err){
      SET_ERROR(1);
      console.log(err);
    }
    if(res && res != 0){
      return res;
    }
  }
  async function playerRecievesItem(item_id:any){
    SET_MAX_TXN(3);
    SET_CURRENT_TXN(1);
    setLoadingScreen(1);
    let amount = parseEther('2000');
    let approve = await ApproveLavx(gameContractAddress, amount);
    console.log('approve:')
    console.log(approve);
    if(approve){
      SET_CURRENT_TXN(2);
      let pay = await SendLavxPayment(amount);
      console.log('pay:');
      console.log(pay);
      if(pay){
        SET_CURRENT_TXN(3);
        let item = await _playerReceivesAnItem(item_id);
        if(item){
          console.log(item);
          let userData = await getPlayerOnChainData();
          if(userData[0] != "0"){
            fillUserObject(userData);
            setLoadingScreen(0);
            history.push('/inventory');
          } else {
            SET_ERROR(1);
            console.log('issue getting data after receiving an item');
          }
        }
      }
    }
  }
  // *********************************************************** //
  // ******************** Helper Functions ********************* //
  // *********************************************************** //
  async function EXIT_LOADING(){
    SET_ERROR(0);
    SET_MAX_TXN(0);
    SET_CURRENT_TXN(0);
    history.push('/');
    setLoadingScreen(0);
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
  async function startFlowingInGameLav(val:any){
    let x = await updateObjectValue("flow_amt", -val, userStatistics);
    setUserStatistics(x);
  }
  function showLoadingScreen(){
    setLoadingScreen(1);
    setTimeout(() => setLoadingScreen(0), 2000);
  }
  function fillUserObject(x:any){
    let obj = {
      'userAddress': x[0].toString(),
      'userNFTId': parseInt(x[1]),
      'userGameItems': x[2].toString().split(',').map((x:string) => parseInt(x))
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
  // *********************************************************** //
  // ******************** Calling Database  ******************** //
  // *********************************************************** //
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

  // *********************************************************** //
  // ******************* Calling Superfluid  ******************* //
  // *********************************************************** //
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
  // *********************************************************** //
  // ****************** Calling eth.storage  ******************* //
  // *********************************************************** //
  async function createFile(){
    let OBJ_TO_SAVE = {
      "name": "LA VIE Character: " + userChainData.userNFTId.toString(),
      "description": "A player's La Vie account. The account contains all in game items the player has earned while playing La Vie.",
      "image": "https://bafkreid3kfmvm62u6pl3c3npwgygqshgr6lgvml45fxl7blhkn7rx57lqm.ipfs.dweb.link/",
      "attributes":[
        {
          "trait_type":"Level",
          "value": userStatistics.level
        },
        {
          "trait_type":"Current XP",
          "value": userStatistics.points
        },
        {
          "trait_type":"Lifetime XP",
          "value": userStatistics.xp
        },
        {
          "trait_type":"Health",
          "value": userStatistics.health
        },
        {
          "trait_type":"Energy",
          "value": userStatistics.energy
        },
        {
          "trait_type":"Stamina",
          "value": userStatistics.stamina
        },
        {
          "display_type": "number", 
          "trait_type": "Missions Accomplished", 
          "value": userStatistics.grind_missions
        }
      ],
      "state": userStatistics
    }
    let jsonObj = JSON.stringify(OBJ_TO_SAVE);

    const blob = new Blob([jsonObj], { type: "application/json" });
    const file = new File([blob], "metadata.json", {
      type: "application/json",
      lastModified: new Date().getTime(),
    });
    return file;
  }
  async function saveGameStateNFT(){
    SET_MAX_TXN(3);
    SET_CURRENT_TXN(1)
    setLoadingMessage('Saving Data to Filecoin. Please Wait.');
    setLoadingScreen(1);

    let cid:any;
    let file = await createFile();

    try{
      cid = await storeState(web3, file, SET_CURRENT_TXN, SET_ERROR);
    } catch(error){
      SET_ERROR(1);
    }

    if(cid){
      let keys = Object.keys(cid);
      SET_CURRENT_TXN(3)
      await saveToNft(cid[keys[0]]);
    }
  }
  // *********************************************************** //
  // ************************** MAIN *************************** //
  // *********************************************************** //
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
        loadingScreen == 1  ? 
        <LoadingLarge message={loadingMessage} MAX_TXN={MAX_TXN} CURRENT_TXN={CURRENT_TXN} ERROR={ERROR} EXIT_LOADING={EXIT_LOADING} /> : 
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
                  itemsForSale={itemsForSale}
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
                  //ClaimRewardFromContract={ClaimRewardFromContract}
                  GetLavxBalance={GetLavxBalance}
                  lavxWalletBal={lavxWalletBal}
                  playerRecievesItem={playerRecievesItem}
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
                updateBillboard={approveAndUpdateBillboard}
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
