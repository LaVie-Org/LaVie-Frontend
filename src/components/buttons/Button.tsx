import React from "react";
import './Buttons.css';




export default function Button(props: any){
    return(
        <button className='buttonMain' onClick={() => props.onClick()}>{props.title}</button>
    );
}