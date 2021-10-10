import React from "react";

export function useInterval(cb:any, delay:any){
    const savedCallback:any = React.useRef();

    React.useEffect(() => {
        savedCallback.current = cb;
    },[cb]);

    React.useEffect(() => {
        function tick(){
            savedCallback.current();
        }
        if(delay != null){
            const id = setInterval(tick, delay);
            return () => {
                clearInterval(id);
            };
        }
    }, [cb, delay])
}