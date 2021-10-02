import React from "react";
import './Account.css';
import Button from '../../components/buttons/Button';

export default function Account(props: any){
    return(
        <div className='fadeInAnimation accountContainer'>
            <div className='accountContainerId'>
                <div className='acIcon'><i className="fas fa-user-circle"></i></div>
                <div className='acAddress'>0x000000000000000000000000000000</div>
            </div>
            <div className='accountContainerRow'>
                <label>Total Staked:</label>
                <span>1000</span>
            </div>
            <div className='accountContainerRow'>
                <label>Interest Earned:</label>
                <span>1000</span>
            </div>
            <div className='accountContainerRow'>
                <label>Time Left:</label>
                <span>10000000</span>
            </div>
            <Button title="Withdraw Stake"  width="150px"/>
            <Button title="Sell Account" width="150px"/>
            <Button title="Delete Account" width="150px"/>
            <Button title="Disconnect" width="150px"/>
        </div>
    );
}