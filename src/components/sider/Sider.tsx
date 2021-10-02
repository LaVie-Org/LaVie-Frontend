import './Sider.css';
import {

    Link
  } from "react-router-dom";

export default function Sider(props: any){
    return(
        <div className='sider-container'>
            <div className='logo'>
                <img src={props.GameAssetsData.main_logo} />
            </div>
            <ul>
                <Link to="/">
                    <li className='actionable'>
                        <label>home</label>
                    </li>
                </Link>
                <Link to="/missions">
                <li className='actionable'>
                    <label>missions</label>
                </li>
                </Link>
                <Link to="/inventory">
                <li className='actionable'>
                    <label>inventory</label>
                </li>
                </Link>
                <Link to="/account">
                <li className='actionable'>
                    <label>account</label>
                </li>
                </Link>
                <Link to="/pvp">
                <li className='actionable'>
                    <label>pvp</label>
                </li>
                </Link>
            </ul>
        </div>
    );
}