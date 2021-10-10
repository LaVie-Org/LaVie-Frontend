import React from "react";
import Button from '../buttons/Button';
import './Billboard.css';

export default function Billboard(props: any){
    let [exitUpgrade, setExitUpgrade] = React.useState(0);
    let [exitHistory, setExitHistory] = React.useState(0);
    let [firstLine, setFirstLine] = React.useState<any>("");
    let [secondLine, setSecondLine] = React.useState<any>("");
    let [thirdLine, setThirdLine] = React.useState<any>("");
    let [submitReady, setSubmitReady] = React.useState(0);
    let [currentPrice, setCurrentPrice] = React.useState<any>(undefined);

    React.useEffect(() => {
        props.getCurrentBillboardPrice(setCurrentPrice);
    }, [])
    React.useEffect(() => {
        console.log(`The current billboard price is: ${currentPrice}`);
    }, [currentPrice])
    React.useEffect(() => {
        if(
            firstLine != "" && firstLine.length <= 50 &&
            secondLine != "" && secondLine.length <= 50 &&
            thirdLine != "" && thirdLine.length <= 50
        ) {
            setSubmitReady(1);
        } else {
            setSubmitReady(0);
        }
    }, [firstLine, secondLine, thirdLine]);
    
    function updateTheBillboard(){
        if(submitReady){
            props.updateBillboard(firstLine, secondLine, thirdLine, currentPrice + 1);
        }
    }
    return(
        <div className='billboardContainer'>
            <div className='billboardPopUp'>
                <div className='billboardHeader'>
                    <ul>
                        <li style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#FED766',
                            borderTop: 'solid 3px',
                            borderBottom: 'solid 3px'
                        }}>
                            Sponsored Billboard
                        </li>
                        <li >
                            <Button title='Upgrade Modal'  width='150px' minHeight='30px' onClick={() => setExitUpgrade(exitUpgrade ? 0 : 1)}/>
                        </li>

                        <li>
                            <Button title='History' width='150px' minHeight='30px' onClick={() => setExitHistory(exitHistory ? 0 : 1)}/>
                        </li>
                    </ul>
                </div>
                <img src={props.billboard} className='billboard'/> 
                { exitUpgrade ? 
                <div className='billboardUpdate'>
                    <div className='billboardModal'>
                        <span className='billboardModalExit'>
                            <i className="fas fa-times" onClick={() => setExitUpgrade(0)}></i>
                        </span>
                        <div className='billboardModalContent'>
                            <div className='bmcElement'>
                                <label>First Line:</label>
                                <input onChange={(e:any) => setFirstLine(e.target.value)}/>
                                <span style={{fontSize: '12px'}}>Must be less than 50 characters.</span>
                            </div>
                            <div className='bmcElement'>
                                <label>Second Line:</label>
                                <input onChange={(e:any) => setSecondLine(e.target.value)}/>
                                <span style={{fontSize: '12px'}}>Must be less than 50 characters.</span>
                            </div>
                            <div className='bmcElement'>
                                <label>Third Line:</label>
                                <input onChange={(e:any) => setThirdLine(e.target.value)}/>
                                <span style={{fontSize: '12px'}}>Must be less than 50 characters.</span>
                            </div>
                            <div className='bmcElement'>
                                <label style={{textAlign:'center'}}>{currentPrice ? currentPrice : 0} LavX</label>
                            </div>
                            <Button onClick={() => updateTheBillboard()} disabled={!submitReady} title='Update Billboard' width='150px' minHeight='25px' fontSize='16px'/>
                        </div>
                    </div>
                </div> : null}
                { exitHistory ? 
                <div className='billboardHistory'>
                    <div className='billboardModal'>
                        <span className='billboardModalExit'>
                            <i className="fas fa-times" onClick={() => setExitHistory(0)}></i>
                        </span>
                    </div>
                </div> : null}
                <span className='billboardModalExit'>
                    <i className="fas fa-times" onClick={props.exitBillboard}></i>
                </span>
            </div> 
        </div>
    );
}