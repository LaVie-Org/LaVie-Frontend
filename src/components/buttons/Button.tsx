import React from "react";
import './Buttons.css';


export default function Button(props: any){
    let [hover, setHover] = React.useState(0);
    return(
        <button 
        className='buttonMain'
        style={{
            width: props.width ? props.width : '100px',
            minHeight: props.minHeight ? props.minHeight : '40px',
            maxHeight: props.maxHeight ? props.maxHeight : '50px',
            fontSize: props.fontSize ? props.fontSize : '100%',
            backgroundColor: !hover ? 'white' : '#FED766',
        }}
        onMouseEnter={() => setHover(1)}
        onMouseLeave={() => setHover(0)}
        onClick={() => props.onClick()}>{props.title}</button>
    );
}