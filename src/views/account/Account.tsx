import React from "react";
import './Account.css';
import Button from '../../components/buttons/Button';
import LoadingLarge from "../../components/loading/LoadingLarge";

export default function Account(props: any){
    let[userAddress] = React.useState(props.web3.account);
    let[userChainData] = React.useState(props.userChainData);
    let[stakeMaturity, setStakeMaturity] = React.useState<any>(undefined);
    let[stakeAmount, setStakeAmount] = React.useState<any>(undefined);
    let[stakeFlag, setStakeFlag] = React.useState<any>(undefined);
    let[accountLoading, setAccountLoading] = React.useState(1);

    async function loadStakeInfo(){
        let a = await props.GetStakeDuration();
        let b = await props.GetStakeAmount();
        let c = await props.GetStakeFlag();
        setStakeMaturity(a);
        setStakeAmount(b);
        setStakeFlag(c);
    }

    React.useEffect(() => {
        loadStakeInfo();
    },[]);

    React.useEffect(() => {
        if(
            stakeMaturity != undefined &&
            stakeAmount !== undefined &&
            stakeFlag !== undefined 
        ) {
            setAccountLoading(0);
        }
    }, [stakeMaturity, stakeAmount, stakeFlag]);

    if(accountLoading){
        return <LoadingLarge message={'Account is loading . . . '}/>
    }

    return(
        <div className='fadeInAnimation accountContainer'>
            <div className='accountContainerId'>
                <div className='acIcon'><i className="fas fa-user-circle"></i></div>
                <div className='acAddress'>{userChainData.userAddress}</div>
            </div>
            <div className='accountContainerRow'>
                <label>NFT ID:</label>
                <span>{userChainData.userNFTId}</span>
            </div>
            <div className='accountContainerRow'>
                <label>Total Staked:</label>
                <span>{stakeAmount / 1000000000000000000}</span>
            </div>
            <div className='accountContainerRow'>
                <label>Time Left:</label>
                <span>{stakeMaturity - props.currBlockNumber}</span>
            </div>
            <Button disabled={stakeFlag} title="Withdraw Stake"  width="150px" />
            <Button disabled={stakeFlag} title="Sell Account" width="150px" onClick={() => props.SellAccountRarible(userChainData.userNFTId)}/>
            <Button disabled={stakeFlag} title="Delete Account" width="150px" onClick={() => props.DeleteAccount(userChainData.userNFTId)}/>
            <Button title="Disconnect" width="150px"/>
        </div>
    );
}