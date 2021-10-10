import React from "react";
import './LayoutStart.css';
import Button from '../buttons/Button';
import ModalLarge from '../modals/ModalLarge';


export default function LayoutStart(props: any){
    let [popModal, setPopModal] = React.useState(0);
    let [itemSelected, setItemSelected] = React.useState(0);
    let [platformSelected, setPlatform] = React.useState(2);

    function exitModal(){
        setItemSelected(0);
        setPopModal(0);
        props.setNewAccount(0);
    }
    function selectAccount(){
        if(itemSelected > 0){
            props.setAccountSelected(itemSelected);
            exitModal();
        }
    }
    return(
        <div className='layoutStartContainer'>
            {props.children ? props.children : null}
            <div className='lsc-content'>
                <ul>
                    <li>
                        <div className='cover-container'>
                            <div className='background-cover'>
                                <img src='https://bafkreiddn6exihkgoqjswzpbllk64bx35miu4k3cv7fpzzffemykn5ywly.ipfs.dweb.link/' />
                            </div>
                            <div className='forward-logo'>
                                <div className='content'>
                                    <img src={props.GameAssetsData.main_logo} />
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: 'center'
                                    }}>
                                        <Button title='PLAY' onClick={props.ConnectWallet}></Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            {
                props.newAccount == 1 ?
                <ModalLarge 
                    exitModal={exitModal}
                    itemSelected={itemSelected}
                    setPlatform={setPlatform}
                    setItemSelected={setItemSelected}
                    GameAssetsData={props.GameAssetsData}
                >
                    <div className='selectbox'>
                        <label>Stake Platform: </label>
                        <select disabled={itemSelected == 0 || itemSelected == 1} onChange={(e:any) => props.setPlatform(e.target.value) }>
                            <option value='2'>Compound</option>
                            <option value='1'>88mph</option>
                        </select>
                    </div>
                    <Button disabled={itemSelected == 0 ? true : false} title='START' onClick={() => selectAccount()}/>
                </ModalLarge> : null
            }
            {/*<div className='polygonIndicator'>
                <label>Only on</label>
                <div>
                    <img src='https://bafkreicizdfuxlhvme4gcue5cqwx6esccgmxz7ctqkkdiuuecuuczq4kea.ipfs.dweb.link/' />
                    <label>polygon</label>
                </div>
        </div>*/}
        </div>
    )
}