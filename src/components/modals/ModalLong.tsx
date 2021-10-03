import Story from "../../views/missions/Story";
import Button from '../buttons/Button';

export default function ModalLong(props:any){
    return(
        <div style={{
            position: 'absolute',
            top: '0',
            height: '500px',
            width: '400px',
            zIndex: 1,
            backgroundColor: '#161214',
            display: 'flex',
            'flexDirection': 'column',
            padding: '10px',
            boxShadow: '3px 3px 0px 3px black',
            border: 'solid black 2px'
        }}>
            <div style={{
                position: 'relative',
                textAlign: 'center',
            }}>
                <h1>{props.story.story_name}</h1>
                <i className="fas fa-times" style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    fontSize: '30px',
                    cursor: 'pointer',
                    color: '#FED766'
                }}
                onClick={props.exit}
                ></i>
            </div>
            <hr style={{width: '100%', height: '5px', boxSizing: 'border-box', backgroundColor: '#FED766', border: 'none'}}></hr>
            <div style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <span style={{
                    padding: '10px',
                    lineHeight: '20px',
                    color: '#c6c6c6'
                }}>{props.story.story_intro}</span>
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                paddingBottom: '20px'
            }}>
                <Button title='Continue' onClick={props.exit}/>
            </div>
            
        </div>
    )
}