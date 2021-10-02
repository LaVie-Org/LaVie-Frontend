import React from "react";
import './Inventory.css';
import Button from '../../components/buttons/Button';

function GameItemSetting(props:any){
    return (
        <div className='gameItemSetting'>
            <div className='gameSettingInfo'>
                <span>Item Name: {props.data.name}</span>
                <span>Item id: {1}</span>
                <span>Item Series: {1}</span>
                <span>NFT id: {1}</span>
                <span>Last Price: {1}</span>
                <span>Last Price: {1}</span>
            </div>
            <div className='gameSettingControls'>
                <Button title='Sell on OpenSea' width='80%' fontSize='12px' minHeight='20px' backgroundColor='#ccc' />
                <Button title='Sell on Rarible' width='80%' fontSize='12px' minHeight='20px'  backgroundColor='#ccc'/>
                <Button title='P2P Transfer' width='80%' fontSize='12px' minHeight='20px'  backgroundColor='#ccc'/>
            </div>
        </div>
    )
}

function GameItem(props: any){
    let [showSettings, setShowSettings] = React.useState(0);
    return(
        <div className='gameItemContainer'>
            <div className='itemImage'><img src={props.data.link}/></div>
            <span>{props.data.name}</span>
            {
                /*<div className='itemCount'>10</div>*/
            }
            <div className='itemOption'><i className="fas fa-cog" onClick={() => setShowSettings(showSettings ? 0 : 1)}></i></div>
            {showSettings ? <div className={`${showSettings ? 'translateAnimation' : null}`}><GameItemSetting data={props.data}/></div> : null}
            
        </div>
    );
}

export default function Inventory(props: any){
    return(
        <div className='inventoryContainer fadeInAnimation'>
            {props.GameAssetsData.items.map((x:object) => <GameItem data={x} key={x.toString()}/>)}
        </div>
    );
}