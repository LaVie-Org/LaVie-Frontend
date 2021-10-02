import React from "react";
import './Inventory.css';

function GameItem(props: any){
    return(
        <div className='gameItemContainer'>
            <div className='itemImage'><img src='https://s3.us-west-2.amazonaws.com/secure.notion-static.com/95c0ccbf-879c-42cd-9653-53fa209adc6f/la_vie_knife.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20211001%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20211001T142534Z&X-Amz-Expires=86400&X-Amz-Signature=dcb10892c9fde738781fdedb83ab2b4a1ee658b6fefed3f55c36f95703adc5a0&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22la_vie_knife.png%22'/></div>
            <span>Knife</span>
            <div className='itemCount'>10</div>
        </div>
    );
}

export default function Inventory(props: any){
    return(
        <div className='inventoryContainer fadeInAnimation'>
            <GameItem />    
        </div>
    );
}