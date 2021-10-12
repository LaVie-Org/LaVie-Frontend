import React from "react";
import './Market.css';
import Button from '../../components/buttons/Button';
import ModalSmall from '../../components/modals/ModalSmall';

export default function Market(props:any){
    let [rewardId, setRewardId] = React.useState(0);
    let [rewardType, setRewardType] = React.useState<any>(undefined);
    let [rewardedItem, setRewardWon] = React.useState<any>(undefined);

    React.useEffect(() => {
        props.GetLavxBalance();    
    },[]);
    function getItemData(itemToGet:number){
        return props.GameAssetsData.items.filter((x:any) => itemToGet == x.id);
    }
    function resetReward(){
        setRewardId(0);
        setRewardType(undefined);
    }

    function getRandomItemFromCrate(tier:any) {
        let rarityWeight:any = [];
        let weightedRareOrNot = [];
        let currentIndex = 0;
        let randomItemNumber = 0;
        let randomNumber = 0;
        let rewardType;
      
        const rareOrNot = [0, 1];
      
        switch (tier) {
          case 1:
            rarityWeight = [99, 1];
            break;
          case 2:
            rarityWeight = [92, 8];
            break;
          case 3:
            rarityWeight = [86, 14];
            break;
        }
      
        while (currentIndex < rareOrNot.length) {
          for (let i = 0; i < rarityWeight[currentIndex]; i++)
            weightedRareOrNot[weightedRareOrNot.length] = rareOrNot[currentIndex];
          currentIndex++;
        }
        randomNumber = Math.floor(Math.random() * 100);
        console.log(weightedRareOrNot);
        console.log(weightedRareOrNot[randomNumber]);
      
        if (weightedRareOrNot[randomNumber]) {
          console.log("YOU GET A RARE ITEM CONGRATS!");
          rewardType = 1;
          randomItemNumber = Math.floor(Math.random() * (25 - 18 + 1) + 18);
        } else {
          console.log("normal item..");
          rewardType = 0;
          randomItemNumber = Math.floor(Math.random() * (17 - 1 + 1) + 1);
        }
        console.log("ItemID: " + randomItemNumber);
        return [randomItemNumber, rewardType];
    }
    function ClaimReward(){
        let loot = getRandomItemFromCrate(2);
        setRewardId(loot[0]);
        setRewardType(loot[1]);
    }
    function BagIt(){
        if(rewardId){
            props.playerRecievesItem(rewardId);
        } else {
            console.log('error')
        }
    }

    return(
        <div className='marketContainer'>
            <div className='marketList'>
                <div className='inGameMarket'>
                    <div className='igmLeft'>
                        <i className="fas fa-box-open"></i>
                        <label>{2000} LaVx</label>
                    </div>
                    <div className='igmRight'>
                        <Button disabled={props.lavxWalletBal > 2000 ? false : true} minHeight='50px' width='200px' title='Claim Reward' onClick={async () => await ClaimReward()}/>
                        {props.lavxWalletBal > 2000 ? null : <label>You don't have enough funds to claim a reward. </label>}
                    </div>
                </div>
                <div className='t3pMarket'>
                    <label>3rd Party Market Coming Soon </label>
                </div>
            </div>
            {
                rewardId > 0 ?
            <div className='modalContainer'>
                <ModalSmall>
                    <h1>You've Got Loot</h1>
                    <hr></hr>
                    <h3>{getItemData(rewardId)[0].name}</h3>
                    <div>
                        <img src={getItemData(rewardId)[0].link}></img>
                    </div>
                    {
                        rewardType == 1 ? <span style={{color: '#FED766', backgroundColor:'black'}}>RARE</span> :
                        <span style={{color: '#FED766', backgroundColor:'black'}}>GENERIC</span>
                    }
                    
                    <Button title='Bag It' onClick={() => BagIt()}/>
                </ModalSmall>
            </div> : null
            }   
        </div>
    )
}