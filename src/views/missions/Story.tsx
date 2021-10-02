import React from "react";
import './Story.css';

const storyDt = [
    {
        "story_id": 1,
        "story_name": "Welcome to the MOB",
        "story_intro": "Turns out, one of the cars you robbed belonged to a mob guy. You return the car. In exchange for your life, you offer your services to the mob guy. From now on, all jobs you do he will take a 85% cut out of the loot.",
        "story_scenes": [
            {
                "story_scene_id": 1,
                "story_scene_name": "Moneybags",
                "stats_req": [
                    {
                        "name":"health",
                        "cost": 2
                    },
                    {
                        "name":"energy",
                        "cost": 1
                    },
                    {
                        "name":"stamina",
                        "cost": 1
                    },
                ],
                "cash_gain": 5000.00,
                "equipment": [2,4,5]
            },
            {
                "story_scene_id": 2,
                "story_scene_name": "Enforcer",
                "stats_req": [
                    {
                        "name":"health",
                        "cost": 1
                    },
                    {
                        "name":"energy",
                        "cost": 1
                    },
                    {
                        "name":"stamina",
                        "cost": 1
                    },
                ],
                "cash_gain": 5000.00,
                "equipment": [2,4,5]
            },
            {
                "story_scene_id": 3,
                "story_scene_name": "Stuntin'",
                "stats_req": [
                    {
                        "name":"health",
                        "cost": 1
                    },
                    {
                        "name":"energy",
                        "cost": 1
                    },
                    {
                        "name":"stamina",
                        "cost": 1
                    },
                ],
                "cash_gain": 5000.00,
                "equipment": [2,4,5]
            },
            {
                "story_scene_id": 1,
                "story_scene_name": "Risque Affair",
                "stats_req": [
                    {
                        "name":"health",
                        "cost": 1
                    },
                    {
                        "name":"energy",
                        "cost": 1
                    },
                    {
                        "name":"stamina",
                        "cost": 1
                    },
                ],
                "cash_gain": 5000.00,
                "equipment": [2,4,5]
            }
        ],
        "decision":0,
        "decisions": []
    },
    {
        "story_id": 2,
        "story_name": "Crypto Rich",
        "story_intro": "One of the people you’ve kidnapped had more than you thought. 12 years ago he bought 2000 Bitcoins at chump change prices. He’s now worth $100 million. He’s offered to pay you for protection.",
        "story_scenes": [
            {
                "story_scene_id": 1,
                "story_scene_name": "Escort & Protect",
                "stats_req": [
                    {
                        "name":"health",
                        "cost": 1
                    },
                    {
                        "name":"energy",
                        "cost": 1
                    },
                    {
                        "name":"stamina",
                        "cost": 1
                    },
                ],
                "cash_gain": 5000.00,
                "equipment": [2,4,5]
            },
            {
                "story_scene_id": 2,
                "story_scene_name": "Flash Owned",
                "stats_req": [
                    {
                        "name":"health",
                        "cost": 1
                    },
                    {
                        "name":"energy",
                        "cost": 1
                    },
                    {
                        "name":"stamina",
                        "cost": 1
                    },
                ],
                "cash_gain": 5000.00,
                "equipment": [2,4,5]
            },
            {
                "story_scene_id": 3,
                "story_scene_name": "Seeing Unicorns'",
                "stats_req": [
                    {
                        "name":"health",
                        "cost": 1
                    },
                    {
                        "name":"energy",
                        "cost": 1
                    },
                    {
                        "name":"stamina",
                        "cost": 1
                    },
                ],
                "cash_gain": 5000.00,
                "equipment": [2,4,5]
            },
            {
                "story_scene_id": 1,
                "story_scene_name": "Where Lambo?",
                "stats_req": [
                    {
                        "name":"health",
                        "cost": 1
                    },
                    {
                        "name":"energy",
                        "cost": 1
                    },
                    {
                        "name":"stamina",
                        "cost": 1
                    },
                ],
                "cash_gain": 5000.00,
                "equipment": [2,4,5]
            }
        ],
        "decision":0,
        "decisions": []
    },
    {
        "story_id": 3,
        "story_name": "The Underground and Metaverse Collide",
        "story_intro": "The mob guy has been hearing you came into a lot of money. He saw you driving a lambo. While he hasn’t enforced the 85% profits that you agreed to when first meeting him - he is now. Pay up.",
        "story_scenes": [],
        "decision":1,
        "decisions": [
            {
                "decision_id": 1,
                "decision_name": "Pay 85% of your entire loot.",
                "decision_desc": "You will literally need to give him 85% of your entire loot IF you got $100,000.00 in your stash. If you do not have that, only option 2 is available."
            },
            {
                "decision_id": 2,
                "decision_name": "Kill him.",
                "decision_desc": ""
            },
        ]
    },
]

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
                gun, knife, house
            </div>
            <button>Do it</button>
            <div className='lock'><i className="fas fa-lock"></i></div>
        </li>
    )
}

function StoryItem(props: any){
    let [showItem, setShowItem] = React.useState(0);
    return(
            <div className={`storyItem ${showItem == 1 ? 'heightIncreseAnimation' : null}`}>
                <div className={`storyItemHeader ${showItem == 1 ? null : null}`}>
                    <label>{props.data.story_name}</label>
                    <span>Intro</span>
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
            {storyDt.map((x) => <RegularOrStory data={x} />)}
        </div>
    );
}