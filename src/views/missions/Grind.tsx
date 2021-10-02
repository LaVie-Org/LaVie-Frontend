import React from "react";
import './Grind.css';


const dt = [
    {
        "mission_id": 1,
        "mission_name": "Mug Someone",
        "health_req": 1,
        "energy_req": 1,
        "stamina_req": 0,
        "cash_gain": 5000.00,
        "equipment": [2,4,5]
    },
    {
        "mission_id": 2,
        "mission_name": "Shoplift",
        "health_req": 1,
        "energy_req": 1,
        "stamina_req": 0,
        "cash_gain": 5000.00,
        "equipment": []
    },
    {
        "mission_id": 3,
        "mission_name": "Burglary",
        "health_req": 1,
        "energy_req": 1,
        "stamina_req": 0,
        "cash_gain": 5000.00,
        "equipment": []
    },
    {
        "mission_id": 4,
        "mission_name": "Protect Escorts",
        "health_req": 1,
        "energy_req": 1,
        "stamina_req": 0,
        "cash_gain": 5000.00,
        "equipment": []
    },
    {
        "mission_id": 4,
        "mission_name": "Rob A Car",
        "health_req": 1,
        "energy_req": 1,
        "stamina_req": 0,
        "cash_gain": 5000.00,
        "equipment": []
    },
    {
        "mission_id": 4,
        "mission_name": "Burglary",
        "health_req": 1,
        "energy_req": 1,
        "stamina_req": 0,
        "cash_gain": 5000.00,
        "equipment": []
    },
    {
        "mission_id": 4,
        "mission_name": "Store Robbery",
        "health_req": 1,
        "energy_req": 1,
        "stamina_req": 0,
        "cash_gain": 5000.00,
        "equipment": []
    },
    {
        "mission_id": 4,
        "mission_name": "Kidnap",
        "health_req": 1,
        "energy_req": 1,
        "stamina_req": 0,
        "cash_gain": 5000.00,
        "equipment": []
    },
    {
        "mission_id": 4,
        "mission_name": "Kill an Op",
        "health_req": 1,
        "energy_req": 1,
        "stamina_req": 0,
        "cash_gain": 5000.00,
        "equipment": []
    },
    {
        "mission_id": 4,
        "mission_name": "Rob A Bank",
        "health_req": 1,
        "energy_req": 1,
        "stamina_req": 0,
        "cash_gain": 5000.00,
        "equipment": []
    }
]

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
            {dt.map((x) =>  <MissionItem data={x}/>)}
        </div>
    )
}