import React from "react";
import './Grind.css';
import GrindMissions from '../../data/missionsGrind.json';
import GameAssets from '../../data/gameAssets.json';

function MissionItem(props:any){
    let [lock, setLock] =  React.useState(1);
    let [hasEquipment, setHasEquipment] = React.useState(0);
    let [hasStats, setHasStats] = React.useState(0);

    React.useEffect(() => {
        checkInventory();
    })

    React.useEffect(() => {
        if(
            props.userStatistics.health >= props.data.health_req &&
            props.userStatistics.energy >= props.data.energy_req &&
            props.userStatistics.stamina >= props.data.stamina_req &&
            hasEquipment
        ) {
            setLock(0);
            
        } else {
            setLock(1);
        }
    });
    React.useEffect(() => {
        if(lock){
            updatePlayable(0);
        } else {
            updatePlayable(1);
        }
    }, [lock])
    async function updatePlayable(val:any){
        let x = await props.updateObjectValueArray("playables", props.userStatistics, val);
        props.setUserStatistics(x);
    }
    async function test(){
        let { data: obj, error } = await props.supabase
        .from('data_dump')
        .select('*');
        console.log(obj);
        console.log(error);
    }

    async function updatePlayerState(mission_id:any){
        //props.setUserStatistics((oldItem:any) => { return ...oldItem.health})
        let nextBlock = await props.web3.eth.getBlockNumber().then((x:any) => x + 1);
        console.log(nextBlock);

        let objToUpdate = await updateObjectValue('health', props.data.health_req, props.userStatistics);
        objToUpdate = await updateObjectValue('energy', props.data.energy_req, objToUpdate);
        objToUpdate = await updateObjectValue('stamina', props.data.stamina_req, objToUpdate);
        objToUpdate = await updateObjectValue('cash', -props.data.cash_gain, objToUpdate);
        objToUpdate = await updateObjectValue('grind_missions', -1, objToUpdate);
        objToUpdate = await updateObjectValue('points', -(20/props.userStatistics.level), objToUpdate);
        objToUpdate = await replaceObjectValue('next_block', nextBlock, objToUpdate);
        

        if(mission_id == 5){
            objToUpdate = await updateObjectValue('grind_rac', -props.data.cash_gain, objToUpdate);
        }
        if(mission_id == 9){
            objToUpdate = await updateObjectValue('grind_kd', -props.data.cash_gain, objToUpdate);
        }
        props.setUserStatistics(objToUpdate);
        props.updateStateDb(objToUpdate);
        console.log(objToUpdate);
        console.log('state updated');
    }
    async function updateObjectValue(key:any, value:any, obj:any){
        // Destructure current state object
        let v = obj[key];
        let objectvalue = {
          ...obj,
          [key]: v - value,
        };
        
        return objectvalue;
    };
    async function replaceObjectValue(key:any, value:any, obj:any){
        // Destructure current state object
        let v = obj[key];
        let objectvalue = {
          ...obj,
          [key]: value,
        };
        
        return objectvalue;
    };
    async function checkInventory(){
        if(props.data.equipment.length == 0){
            setHasEquipment(1);
        } else {
            let meetsReq:any;
            for(var i = 0; i < props.data.equipment.length; i++){
                if(props.userChainData.userGameItems.includes(props.data.equipment[i])){
                    meetsReq = 1;
                } else {
                    meetsReq = 0;
                }
            }
            setHasEquipment(meetsReq);
        }
    }

    return(
        <div className='missionItem'>
            <label>{props.data.mission_name}</label>
            <div className='missionStatCost'>
                <label>Cost</label>
                <span><span>{props.data.health_req > 0 ? props.data.health_req : '-'}</span><i className="fas fa-heartbeat" style={{'color':'#C1292E'}}></i></span>
                <span><span>{props.data.energy_req > 0 ? props.data.energy_req : '-'}</span><i className="fas fa-bolt" style={{'color':'#FED766'}}></i></span>
                <span><span>{props.data.stamina_req > 0 ? props.data.stamina_req : '-'}</span><i className="fas fa-dumbbell" style={{'color':'#4281A4'}}></i></span>
            </div>
            <div className='missionEqNeeded'>
                {props.data.equipment.map((x:any) => <span><img src={GameAssets.items.filter((equipment) => x == equipment.id)[0].link}/></span>)}
            </div>
            <div className='missionStart'>
                <button disabled={lock ? true : false} onClick={() => updatePlayerState(props.data.mission_id)}>Do Gig!</button>
            </div>
            <div className='missionGain'>
                + {props.data.cash_gain} LaVx
            </div>
            {
                lock ? <div className='lock'><i className="fas fa-lock"></i></div> : null
            }
            
        </div>
    );
}

export default function Grind(props: any){
    return(
        <div className='missionGrindContainer fadeInAnimation'>
            {GrindMissions.map((x) =>  
            <MissionItem 
                data={x} 
                supabase={props.supabase}
                userChainData={props.userChainData}
                setUserStatistics={props.setUserStatistics}
                userStatistics={props.userStatistics}
                lockPlayerAccount={props.lockPlayerAccount}
                updateStateDb={props.updateStateDb}
                updateObjectValueArray={props.updateObjectValueArray}
                updateNextBlockState={props.updateNextBlockState}
                web3={props.web3}
            />)}
        </div>
    )
}