import React from "react";
import Button from '../buttons/Button';
import './Modals.css';

export default function ModalLarge(props: any){
    return(
    <div className='modal-large'>
        <div className='modal-large-content'>
            <div className='modal-start' onClick={() => props.exitModal()}>
                <i className="fas fa-times"></i>
            </div>
            <div className='modal-main'>
                <div className={`mm-selection ${props.itemSelected == 1 ? 'active' : null}`} onClick={() => props.setItemSelected(1)}>1</div>
                <div className={`mm-selection ${props.itemSelected == 2 ? 'active' : null}`} onClick={() => props.setItemSelected(2)}>2</div>
                <div className={`mm-selection ${props.itemSelected == 3 ? 'active' : null}`} onClick={() => props.setItemSelected(3)}>3</div>
            </div>
            {props.children}
        </div>
     </div>
    );
}