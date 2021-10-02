import React from "react";
import './Home.css';
import { Link } from "react-router-dom";

export default function Home(props:any){
    return(
        <div className='containerHomeView fadeInAnimation'>
            <div className='logo'>
                <div>
                    <img src={props.GameAssetsData.main_logo} />
                </div>
            </div>
            <div className='menu-options'>
                <ul>
                    <Link to='/missions'><li>home</li></Link>
                    <Link to='/missions'><li>missions</li></Link>
                    <Link to='/inventory'><li>inventory</li></Link>
                    <Link to='/account'><li>account</li></Link>
                    <Link to='/pvp'><li>pvp</li></Link>
                </ul>
            </div>
        </div>
    );
}