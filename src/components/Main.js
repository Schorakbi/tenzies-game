import React from "react";
import Square from "./Square";
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import Timer from "./Timer"

export default function Main() {

    const [bestScore,setBestScore] = React.useState(
        () => JSON.parse(localStorage.getItem("best")) || "-"
    );
    const [gameOver, setGameOver] = React.useState(false);
    const [numberOfRolls , setNumberOfRolls] = React.useState(0);
    const [dice, setDice] = React.useState(getNewDice())
    const [time, setTime] = React.useState(0);
    const [running, setRunning] = React.useState(false);
    const [bestTime, setBestTime] = React.useState(
      () => JSON.parse(localStorage.getItem("bestTime")) || "-"
    );
    React.useEffect(() => {
      let startTime;
      let interval;
    
      if (running) {
        startTime = performance.now();
    
        interval = setInterval(() => {
          const currentTime = performance.now();
          setTime((prevTime) => prevTime + (currentTime - startTime));
          startTime = currentTime;
        }, 10);
      } else if (!running) {
        clearInterval(interval);
      }
    
      return () => clearInterval(interval);
    }, [running]);    
  function getNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push({
        id: i,
        value : Math.floor(Math.random() * 6) + 1 ,
        clicked: false,
      });
    }
    return newDice;
  }
  function resetGame() {
    setGameOver(false);
    setNumberOfRolls(0);
    setDice(getNewDice());
    setTime(0);
  }
  
  function freezeDie(index) {
    
    
    setDice(oldDice =>
      oldDice.map((item) =>
        item.id === index
          ? { ...item, clicked: !item.clicked }
          : item
      )
    );
    if (!running) {
      setRunning(true);
    }
    
  }
  React.useEffect(() => {
    const value = dice[0].value;
    const allClicked = dice.every(item => item.clicked);
    const allEqual = dice.every(item => item.value === value)
    if (allEqual && allClicked) {
      setRunning(false);
      setGameOver(true);
    }
  }, [dice]);
  React.useEffect(() => {
    if ((numberOfRolls < bestScore || bestScore === "-") && gameOver) {
        setBestScore(numberOfRolls);
        localStorage.setItem("best", JSON.stringify(numberOfRolls));
        
    }
    
  },[numberOfRolls,bestScore,gameOver])
  React.useEffect(() => {
    if ((bestTime > time || bestTime === "-") && gameOver) {
      
      setBestTime(time);
      localStorage.setItem("bestTime", JSON.stringify(time));
      
      
    }
  }, [time, bestTime, gameOver]);


  let diceArray = dice.map((item) => (
    <Square
      key={item.id}
      value={item.value}
      clicked={item.clicked}
      freezeDie={() => freezeDie(item.id)}
      dots = {getDotsForValue}
    />
  ));

  function rollDice() {
    setDice((oldDice) =>
      oldDice.map((item) =>
        item.clicked ? item : { ...item, value: Math.floor(Math.random() * 6) + 1 }
      )
    );
    setNumberOfRolls(oldNumberOfRolls => oldNumberOfRolls +1);
  }
  const { width, height } = useWindowSize();
  function getDotsForValue(value) {
    switch (value) {
      case 1:
        return <div className="dot center middle"></div>;
      case 2:
        return (
          <>
            <div className="dot top left"></div>
            <div className="dot bottom right"></div>
          </>
        );
      case 3:
        return (
          <>
            <div className="dot top left"></div>
            <div className="dot center middle"></div>
            <div className="dot bottom right"></div>
          </>
        );
      case 4:
        return (
          <>
            <div className="dot top left"></div>
            <div className="dot top right"></div>
            <div className="dot bottom left"></div>
            <div className="dot bottom right"></div>
          </>
        );
      case 5:
        return (
          <>
            <div className="dot top left"></div>
            <div className="dot top right"></div>
            <div className="dot center middle"></div>
            <div className="dot bottom left"></div>
            <div className="dot bottom right"></div>
          </>
        );
      case 6:
        return (
          <>
            <div className="dot top left"></div>
            <div className="dot top right"></div>
            <div className="dot middle left"></div>
            <div className="dot middle right"></div>
            <div className="dot bottom left"></div>
            <div className="dot bottom right"></div>
          </>
        );
      default:
        return null; // Return null for any unexpected value
    }
    
}
function getTime(value) {
  if(value !== "-"){
    const a =("0" + Math.floor(value/60000) %60).slice(-2)
    const b =("0" + Math.floor(value/1000) %60).slice(-2)
    const c =("0" + Math.floor(value/10) %100).slice(-2)
    return(a+":"+b+":"+c)
  }
  else {
    return "-"
  }
}
  return (
    <div className="container">
      <div className="tenzies-container">
        <h1 className="game-title">Tenzies</h1>
        <h1 className="best-score">Your Best Score : {bestScore}</h1>
        <h1 className="best-time">Your Best Time : {getTime(bestTime)}</h1>
        <p className="game-explanation">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
        <Timer 
          time = {time}
        />
        <div className="dice-container">{diceArray}</div>
        {gameOver ? (
        <><Confetti
                      width={width}
                      height={height} 
                      />
                      <button 
                      onClick={resetGame} 
                      className="roll-button"
                      >
                          New Game
                      </button>
                      <h1>X {numberOfRolls}</h1>
                      </>
        ) : (
          <>
            <button onClick={rollDice} className="roll-button">
            Roll
            </button>
            <h1>X {numberOfRolls}</h1>
          </>
          
        )}
      </div>
    </div>
  );
}
