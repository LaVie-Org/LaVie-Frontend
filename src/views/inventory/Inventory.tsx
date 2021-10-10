import React from "react";
import './Inventory.css';
import Button from '../../components/buttons/Button';
import GameAssetsData from '../../data/gameAssets.json';

function GameItemSetting(props:any){
    return (
        <div className='gameItemSetting'>
            <div className='gameSettingInfo'>
                <span onClick={() => console.log(props.userData)}>Item Name: {props.data.name}</span>
                <span>Item id: {props.data.id}</span>
                <span>NFT id: {props.userData.userNFTId}</span>
            </div>
            <div className='gameSettingControls'>
                <Button onClick={() => props.SellItemRarible(props.data.id)} title='Sell on Rarible' width='80%' fontSize='20px' minHeight='50px'  backgroundColor='#ccc'/>
            </div>
        </div>
    )
}

function GameItem(props: any){
    let [showSettings, setShowSettings] = React.useState(0);
    let [itemSpecs, setItemSpecs] = React.useState(getItemData(props.data));
    function getItemData(itemToGet:number){
        return GameAssetsData.items.filter((x) => itemToGet == x.id);
    }
    return(
        <div className='gameItemContainer'>
            <div className='itemImage'><img src={itemSpecs[0].link}/></div>
            <span>{itemSpecs[0].name}</span>
            {
                /*<div className='itemCount'>10</div>*/
            }
            <div className='itemOption'><i className="fas fa-cog" onClick={() => setShowSettings(showSettings ? 0 : 1)}></i></div>
            {showSettings ? <div className={`${showSettings ? 'translateAnimation' : null}`}><GameItemSetting userData={props.userData} data={itemSpecs[0]} SellItemRarible={props.SellItemRarible}/></div> : null}
            
        </div>
    );
}

export default function Inventory(props: any){
    return(
        <div className='inventoryContainer fadeInAnimation'>
            {props.userChainData.userGameItems.map((x:number) => <GameItem userData={props.userChainData} SellItemRarible={props.SellItemRarible} data={x} key={x.toString()}/>)}
        </div>
    );
}