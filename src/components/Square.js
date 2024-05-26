import React from "react";

export default function Square(props){
    return(
        <div 
        className={ props.clicked ? "face square-clicked" : "face"}
        onClick={() => props.freezeDie()}
        >
            {props.dots(props.value)}
        </div>
    )
}