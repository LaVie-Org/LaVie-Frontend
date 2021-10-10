import React from 'react';
import './Chat.css';

function ChatElement(props:any){
    return(
        <div className='chatElement'>
            {
                props.data.to.toString() == 'out' ?
                <span style={{textAlign:'right'}}>{props.data.text}</span> : 
                <span style={{textAlign:'left'}}>{props.data.text}</span> 
            }
            
            <label style={{color: '#464545'}}>{props.data.timestamp.toString()}</label>
        </div>
    );
}

export default function Chat(props: any){
    let [msg, setMsg] = React.useState('');

    function sendMessageAndClear(msg:any){
        props.sendMessage(msg);
        setMsg('');
    }
    return(
        <div className='chatMsgContainer'>
            <div>
                <div className='elemList'>
                {
                    props.messages ? props.messages.map((x:any) => <ChatElement data={x} />) : null
                }
                </div>
                <div className='chatInputBox'>
                    <input value={msg} onChange={(e) => setMsg(e.target.value)}/>
                    <button onClick={() => sendMessageAndClear(msg)} style={{backgroundColor:'green', color: 'white', border: 'none'}}><i className="far fa-paper-plane"></i></button>
                    <button onClick={props.hideChat} style={{backgroundColor:'#ccc', color: 'black', border: 'none'}}> <i className="fas fa-eye-slash"></i></button>
                </div>
            </div>
        </div>
    )
}