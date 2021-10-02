import React from "react";

const barContainer = {
    display: 'flex',
    'flex-direction': 'row',
    'justify-content': 'center',
    'align-items': 'center',
    'align-content': 'center',
    'padding-top': '10px',
    'padding-bottom': '10px',

}

const col = {
    display: 'flex',
    'flex-direction': 'column',
    'justify-content': 'center',
    'align-items': 'center',
    'align-content': 'center',
    'font-size': '15px',
    'font-weight': '800',
}
const bar = {
    
    width: '150px',
    border: 'solid 1px #FED677',
    height: '20px',
    'margin': '5px 5px 5px 5px',
    'display': 'flex',
    'alignItems': 'center'
}
const span = {
    fontSize: '10px',
    paddingBottom: '2px'
}
export default function Level(props: any){
    return(
        <div style={barContainer}>
            <div id='end' style={col}>
                <span style={{'color':'#FED677', 'paddingLeft': '10px', 'paddingRight': '10px', 'textAlign': 'center'}}>Level: {props.endLv}</span>
            </div>
            <div style={col}>
                <div id='bar' style={bar}>
                    <div style={{
                        'marginLeft': '0.5px',
                        'backgroundColor': 'red',
                        'color': 'transparent',
                        'width': `${(props.currXp/props.endXp) * 100}%`,
                        'height': '90%'
                    }}></div>
                </div>
                <span style={span}>{props.currXp} / {props.endXp}</span>
            </div>
            
        </div>
    );
}