import React from "react";
import Button from '../buttons/Button';
import './Modals.css';

export default function ModalLarge(props: any){
    return(
    <div className='modal-large'>
        <div className='modal-large-content'>
            <div className='modal-start' onClick={() => props.exitModal()}>
                <i className="fas fa-times"></i>
            </div>
            <div className='modal-main'>
                <div className={`mm-selection ${props.itemSelected == 1 ? 'active' : null}`} onClick={() => props.setItemSelected(1)}>
                    <div className='mmsImage'>
                        <img src={props.GameAssetsData.crates[0].link}></img>
                    </div>
                    <div className='mmsTitle'>
                        <h1><span className='labelEffect'>Stake:</span>$0.00</h1>
                    </div>
                    <div className='mmsInfo'>
                        <ul>
                            <li><span className='labelEffect'>Duration:</span> 0 month</li>
                        </ul>
                    </div>
                </div>
                <div className={`mm-selection ${props.itemSelected == 2 ? 'active' : null}`} onClick={() => props.setItemSelected(2)}>
                    <div className='mmsImage'>
                        <img src={props.GameAssetsData.crates[1].link}></img>
                    </div>
                    <div className='mmsTitle'>
                        <h1><span className='labelEffect'>Stake:</span>$50.00</h1>
                    </div>
                    <div className='mmsInfo'>
                        <ul>
                            <li><span className='labelEffect'>Duration:</span> 2 Months</li>
                            <li><span className='labelEffect'>Equipment:</span> 2 Generic Items</li>
                        </ul>
                    </div>
                </div>
                <div className={`mm-selection ${props.itemSelected == 3 ? 'active' : null}`} onClick={() => props.setItemSelected(3)}>
                    <div className='mmsImage'>
                        <img src={props.GameAssetsData.crates[2].link}></img>
                    </div>
                    <div className='mmsTitle'>
                        <h1><span className='labelEffect'>Stake:</span>$100.00</h1>
                    </div>
                    <div className='mmsInfo'>
                        <ul>
                            <li><span className='labelEffect'>Duration:</span> 4 Months</li>
                            <li><span className='labelEffect'>Equipment:</span> 3 Generic Items</li>
                            <li><span className='labelEffect'>Rare:</span> 1 Item</li>
                        </ul>
                    </div>
                </div>
            </div>
            {props.children}
        </div>
     </div>
    );
}