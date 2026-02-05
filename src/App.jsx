import { useEffect, useRef, useState } from "react";
import "./App.css";
import clickSound from "./sounds/click.mp3";

/* ---------- Winner Logic ---------- */
const calculateWinner = (board) => {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];

  for (let [a,b,c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

/* ---------- HARD AI ---------- */
const getBestMove = (board) => {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];

  for (let l of lines) {
    const v = l.map(i => board[i]);
    if (v.filter(x => x === "O").length === 2 && v.includes(null)) {
      return l[v.indexOf(null)];
    }
  }

  for (let l of lines) {
    const v = l.map(i => board[i]);
    if (v.filter(x => x === "X").length === 2 && v.includes(null)) {
      return l[v.indexOf(null)];
    }
  }

  if (board[4] === null) return 4;

  const corners = [0,2,6,8].filter(i => board[i] === null);
  if (corners.length) return corners[Math.floor(Math.random()*corners.length)];

  const empty = board.map((v,i)=>v===null?i:null).filter(v=>v!==null);
  return empty[Math.floor(Math.random()*empty.length)];
};

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const audioRef = useRef(new Audio(clickSound));

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(c => c !== null);

  const playSound = () => {
    if (!soundOn) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  useEffect(() => {
    if (aiEnabled && !winner && !isDraw && !isXNext) {
      const move = getBestMove(board);
      setTimeout(() => {
        const newBoard = [...board];
        newBoard[move] = "O";
        setBoard(newBoard);
        setIsXNext(true);
        playSound();
      }, 500);
    }
  }, [aiEnabled, isXNext, board, winner, isDraw]);

  const handleClick = (index) => {
    if (board[index] || winner || isDraw) return;
    if (aiEnabled && !isXNext) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext(!isXNext);
    playSound();
  };

  const restartGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <div className="container">

        {/* Settings Icon */}
        <div className="settings-icon" onClick={() => setShowSettings(!showSettings)}>
          ⚙️
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="settings-panel">
            <h3>Settings</h3>

            <label>
              <input
                type="checkbox"
                checked={aiEnabled}
                onChange={() => setAiEnabled(!aiEnabled)}
              />{" "}
              Play with Computer 🤖
            </label>

            <label>
              <input
                type="checkbox"
                checked={soundOn}
                onChange={() => setSoundOn(!soundOn)}
              />{" "}
              Sound {soundOn ? "ON 🔊" : "OFF 🔇"}
            </label>

            <label>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />{" "}
              {darkMode ? "Dark 🌙" : "Light ☀️"} Mode
            </label>
          </div>
        )}

        <h1>Tic Tac Toe</h1>

        <h2 className={winner ? "winner-text" : isDraw ? "draw-text" : ""}>
          {winner
            ? `Winner: ${winner} 🎉`
            : isDraw
            ? "Game Draw 😐"
            : `Next Player: ${isXNext ? "X" : "O"}`}
        </h2>

        <div className="board">
          {board.map((value, index) => (
            <button
              key={index}
              className="cell"
              onClick={() => handleClick(index)}
            >
              {value}
            </button>
          ))}
        </div>

        <button className="restart" onClick={restartGame}>
          Restart Game
        </button>
      </div>
    </div>
  );
}

export default App;
