import React from "react";
import './Loading.css';

export default function LoadingLarge(props:any){
    return(
        <div className='loadinglg-container'>{props.message}</div>
    );
}