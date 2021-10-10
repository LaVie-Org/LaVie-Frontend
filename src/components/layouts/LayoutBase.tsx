import './LayoutBase.css';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import Sider from '../sider/Sider';
import React from 'react';


export default function LayoutBase(props:any){
    return (
        <div className='layoutbase-container'>
            <div className='container-col'>
                <Sider GameAssetsData={props.GameAssetsData} setSaveProgress={props.setSaveProgress}/>
            </div>
            <div className='container-col'>
                <Header playerGameState={props.playerGameState}></Header>
                <div className='containerContent'>
                    {props.children}
                </div>
            </div>
        </div>
    );
};