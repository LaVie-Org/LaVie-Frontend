import React from "react";
import './Grind.css';
import GrindMissions from '../../data/missionsGrind.json';

function MissionItem(props:any){
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
                <label>Equipment</label>
                <span>gun</span>
                <span>house</span>
                <span>car</span>
            </div>
            <div className='missionStart'>
                <button>Do Gig!</button>
            </div>
            <div className='missionGain'>
                +$0.00
            </div>
        </div>
    );
}

export default function Grind(props: any){
    return(
        <div className='missionGrindContainer fadeInAnimation'>
            {GrindMissions.map((x) =>  <MissionItem data={x}/>)}
        </div>
    )
}