import React from "react";
import Loader from "react-loader-spinner";
import './Loading.css';
import Button from '../buttons/Button';

export default function LoadingLarge(props:any){
    return(
        <div className='loadinglg-container'>
            <div className='loadingContent'>
            <div className='title'>
                <h1 style={{color: '#FED766'}}>{props.message ? props.message : 'NO MESSAGE'}</h1>
            </div>
            <div className='loader'>
                <Loader 
                    type="TailSpin"
                    color="#FED766"
                    height={100}
                    width={100}
                />
            </div>
            <div className='subTitle'>
            {
                props.MAX_TXN > 0 ?
                <h3 style={{color: '#CCC'}}>Transaction: {props.CURRENT_TXN} / {props.MAX_TXN}</h3> : null
            }
            </div>

            <div className='error'>
                {
                    props.ERROR ?
                <React.Fragment>
                    <h2>There was an error with the last transaction.</h2>
                    <h2>Please try again later.</h2>
                    <Button title='Back to Main Menu' width='150px' onClick={() => props.EXIT_LOADING()} />
                </React.Fragment> : null
                }
            </div>

            </div>
        </div>
    );
}