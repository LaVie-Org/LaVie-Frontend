import React from "react";
import './Inventory.css';

function GameItem(props: any){
    return(
        <div className='gameItemContainer'>
            <div className='itemImage'><img src={props.data.link}/></div>
            <span>{props.data.name}</span>
            <div className='itemCount'>10</div>
            <div className='itemOption'><i className="fas fa-cog"></i></div>
        </div>
    );
}

export default function Inventory(props: any){
    return(
        <div className='inventoryContainer fadeInAnimation'>
            {props.GameAssetsData.items.map((x:object) => <GameItem data={x} />)}
        </div>
    );
}