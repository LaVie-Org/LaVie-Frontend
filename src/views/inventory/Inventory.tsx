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
                {
                    props.itemForSale == true ? <span style={{color: "#FED766", fontSize:"20px", textAlign: "center"}}>ON SALE</span> : null
                }
            </div>
            <div className='gameSettingControls'>
                <Button disabled={props.itemForSale == true ? true : false} onClick={() => props.SellItemRarible(props.data.id)} title='Sell on Rarible' width='80%' fontSize='20px' minHeight='50px'  backgroundColor='#ccc'/>
            </div>
        </div>
    )
}

function GameItem(props: any){
    let [showSettings, setShowSettings] = React.useState(0);
    let [itemSpecs, setItemSpecs] = React.useState(getItemData(props.data));
    let [itemForSale, setItemForSele] = React.useState(props.itemsForSale.includes(itemSpecs[0].id))

    function getItemData(itemToGet:number){
        return GameAssetsData.items.filter((x) => itemToGet == x.id);
    }
    function showSettingsv2(val:any){
        setItemForSele(props.itemsForSale.includes(itemSpecs[0].id));
        setShowSettings(val);
    }
    return(
        <div className='gameItemContainer'>
            <div className='itemImage'><img src={itemSpecs[0].link}/></div>
            <span>{itemSpecs[0].name}</span>
            {
                /*<div className='itemCount'>10</div>*/
            }
            <div className='itemOption'><i className="fas fa-cog" onClick={() => showSettingsv2(showSettings ? 0 : 1)}></i></div>
            {showSettings ? <div className={`${showSettings ? 'translateAnimation' : null}`}><GameItemSetting itemForSale={itemForSale} userData={props.userData} data={itemSpecs[0]} SellItemRarible={props.SellItemRarible}/></div> : null}
            
        </div>
    );
}

export default function Inventory(props: any){
    return(
        <div className='inventoryContainer fadeInAnimation'>
            {props.userChainData.userGameItems.map((x:number) => <GameItem itemsForSale={props.itemsForSale}userData={props.userChainData} SellItemRarible={props.SellItemRarible} data={x} key={x.toString()}/>)}
        </div>
    );
}