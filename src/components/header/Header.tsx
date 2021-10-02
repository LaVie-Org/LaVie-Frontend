import './Header.css';
import Level from '../stats/Level';

export default function Header(props:any){
    return(
        <div className='headerContainer'>
            <ul className='statsUiDisplayContainer'>
                <li className='statsUiDisplay'>
                    <div><i className="fas fa-heartbeat" style={{'color':'#C1292E'}}></i></div>
                    <div>10 / 10</div>
                </li>
                <li className='statsUiDisplay'>
                    <div><i className="fas fa-bolt" style={{'color':'#FED766'}}></i></div>
                    <div>10 / 10</div>
                </li>
                <li className='statsUiDisplay'>
                    <div><i className="fas fa-dumbbell" style={{'color':'#4281A4'}}></i></div>
                    <div>10 / 10</div>
                </li>
                <li className='statsUiDisplay'>
                    <div><i className="fas fa-money-bill-alt" style={{'color':'#618B25'}}></i></div>
                    <div>0.00</div>
                </li>
                <li className='statsUiDisplay'>
                    <Level 
                        currLv={0}
                        currXp={0}
                        endXp={100}
                        endLv={1}
                    />
                </li>
            </ul>
        </div>
    );
}