import React from "react";
import './Story.css';
import Button from '../../components/buttons/Button';
import ModalLong from '../../components/modals/ModalLong';
import StoryMissions from '../../data/missionsStory.json';
import GameAssets from '../../data/gameAssets.json';

function StoryEquimentList(props:any){
    let x = GameAssets.items.filter((equipment) => props.item == equipment.id);
    console.log(x);
    return <img src={x[0].link}/>
}

function StoryCost(props:any){
    //console.log(props)
    let x;
    switch(props.data.name){
        case "health":
            x = <i className="fas fa-heartbeat" style={{'color':'#C1292E'}}></i>
            break;
        case "energy":
            x = <i className="fas fa-bolt" style={{'color':'#FED766'}}></i>
            break;
        case "stamina":
            x = <i className="fas fa-dumbbell" style={{'color':'#4281A4'}}></i>
            break;
    }
    return  <li>
                <label>{props.data.cost}</label>
                {x}
            </li>;
}

function StoryItemElement(props: any){
    return(
        <li className='StoryItemElement'>
            <label>{props.data.story_scene_name}</label>
            <span className='StoryItemElementCost'>
                <ul>
                    {props.data.stats_req.map((x:any) => <StoryCost data={x} />)}
                </ul>
            </span>
            <div>
                {props.data.equipment.map((x:number) => <StoryEquimentList item={x}/>)}
            </div>
            <button>Do it</button>
            <div className='lock'><i className="fas fa-lock"></i></div>
        </li>
    )
}

function StoryItem(props: any){
    let [showItem, setShowItem] = React.useState(0);
    let [showDescModal, setShowDescModal] = React.useState(0);
    return(
            <React.Fragment>
            <div className={`storyItem ${showItem == 1 ? 'heightIncreseAnimation' : null}`}>
                <div className={`storyItemHeader ${showItem == 1 ? null : null}`}>
                    <label>{props.data.story_name}</label>
                    <Button title='Intro' width='60px' onClick={() => setShowDescModal(1)}/>
                    {
                        showItem == 1 ? 
                        <i style={{'fontSize': '30px', 'cursor': 'pointer', 'color': '#FED766'}} className="fas fa-arrow-circle-up " onClick={() => setShowItem(showItem != 1 ? 1 : 0)}></i> :
                        <i style={{'fontSize': '30px', 'cursor': 'pointer', 'color': '#FED766'}} className="fas fa-arrow-circle-down" onClick={() => setShowItem(showItem != 1 ? 1 : 0)}></i>
                    }
                    
                </div>
                <div className={`storyItemCollapsable ${showItem == 1 ? 'showItem' : 'noShowItem'}`}>
                    <ul>
                        {props.data.story_scenes.map((scenes: any) => <StoryItemElement data={scenes}/>)}
                    </ul>
                </div>
            </div>
            {
                showDescModal ? <ModalLong story={props.data} exit={() => setShowDescModal(0)}/> : null
            }
            
            </React.Fragment>
    )
}

function RegularOrStory(props:any){
    if(props.data.decision == 0) {
        return <StoryItem data={props.data} />
    } else {
        return null;
    }
}

export default function Story(props: any){
    return(
        <div className='storyContainer fadeInAnimation'>
            {StoryMissions.map((x) => <RegularOrStory data={x} />)}
            
        </div>
    );
}