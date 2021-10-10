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
                        <h1>
                            <span className='labelEffect'>Stake:</span>
                            <img src='https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png' height='30' width='30' />
                            <label style={{paddingLeft: '5px'}}>0</label>
                        </h1>
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
                        <h1>
                            <span className='labelEffect'>Stake:</span>
                            <img src='https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png' height='30' width='30' />
                            <label style={{paddingLeft: '5px'}}>100</label>
                        </h1>
                    </div>
                    <div className='mmsInfo'>
                        <ul>
                            <li><span className='labelEffect'>Duration:</span> 1 Month</li>
                            <li><span className='labelEffect'>Daily LaVx Flow:</span> 10 X 100</li>
                            <li><span className='labelEffect'>Equipment:</span> 2 Generic Items</li>
                        </ul>
                    </div>
                </div>
                <div className={`mm-selection ${props.itemSelected == 3 ? 'active' : null}`} onClick={() => props.setItemSelected(3)}>
                    <div className='mmsImage'>
                        <img src={props.GameAssetsData.crates[2].link}></img>
                    </div>
                    <div className='mmsTitle'>
                        <h1>
                            <span className='labelEffect'>Stake:</span>
                            <img src='https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png' height='30' width='30' />
                            <label style={{paddingLeft: '5px'}}>200</label>
                        </h1>
                    </div>
                    <div className='mmsInfo'>
                        <ul>
                            <li><span className='labelEffect'>Duration:</span> 2 Months</li>
                            <li><span className='labelEffect'>Daily LaVx Flow:</span> 10 X 200</li>
                            <li><span className='labelEffect'>Equipment:</span> 3 Generic Items</li>
                        </ul>
                    </div>
                </div>
            </div>
            {props.children}
        </div>
     </div>
    );
}

/*
                            <li className='selectbox'>
                                <label>Stake Platform: </label>
                                <select onChange={(e) => props.setPlatform(e.target.value) } style={{
                                    textAlign: 'center',
                                    
                                }}>
                                    <option value='2'>Compound</option>
                                    <option value='1'>88mph</option>
                                    
                                </select>
                            </li>
*/ 