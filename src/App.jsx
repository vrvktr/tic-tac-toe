import React,{ useState } from "react";

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const emptyBoard = () => Array(9).fill("");

function App() {
  const [board, setBoard] = useState(emptyBoard);
  const [turn, setTurn] = useState("X");
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [winner, setWinner] = useState("");
  const [winningCells, setWinningCells] = useState([]);

  const playCell = (index) => {
    if (board[index] || winner) return;

    const nextBoard = [...board];
    nextBoard[index] = turn;

    const winningCombination = WINNING_COMBINATIONS.find((combination) =>
      combination.every((cellIndex) => nextBoard[cellIndex] === turn)
    );

    setBoard(nextBoard);

    if (winningCombination) {
      setWinner(turn);
      setWinningCells(winningCombination);
      setScores((current) => ({ ...current, [turn]: current[turn] + 1 }));
      return;
    }

    if (nextBoard.every(Boolean)) {
      setWinner("Draw");
      setWinningCells([]);
      setScores((current) => ({ ...current, draws: current.draws + 1 }));
      return;
    }

    setTurn(turn === "X" ? "O" : "X");
  };

  const restartRound = () => {
    setBoard(emptyBoard());
    setTurn("X");
    setWinner("");
    setWinningCells([]);
  };

  const resetAll = () => {
    restartRound();
    setScores({ X: 0, O: 0, draws: 0 });
  };

  const roundButtonText = winner && winner !== "Draw" ? "Play Again" : "Restart Round";

  return (
    <main className="app-shell">
      <section className="game-card card border-0">
        <h1 className="game-title">Tic-Tac-Toe</h1>

        <div className="score-row" aria-label="Game scores">
          <span className="score-pill score-x">X: {scores.X}</span>
          <span className="score-pill">Draws: {scores.draws}</span>
          <span className="score-pill score-o">O: {scores.O}</span>
        </div>

        <p className="turn-label" aria-live="polite">
          {winner === "Draw" ? "Draw!" : winner ? `Winner: ${winner}` : `Turn: ${turn}`}
        </p>

        <div className="game-board" role="group" aria-label="Tic-Tac-Toe board">
          {board.map((cell, index) => {
            const isWinningCell = winningCells.includes(index);
            return (
              <button
                className={`game-cell ${isWinningCell ? "winning-cell" : ""} ${
                  cell === "X" ? "cell-x" : cell === "O" ? "cell-o" : ""
                }`}
                key={index}
                type="button"
                aria-label={`Cell ${index + 1}${cell ? `, ${cell}` : ", empty"}`}
                onClick={() => playCell(index)}
                disabled={Boolean(cell) || Boolean(winner)}
              >
                {cell}
              </button>
            );
          })}
        </div>

        <div className="action-row">
          <button className="btn btn-primary restart-button" type="button" onClick={restartRound}>
            {roundButtonText}
          </button>
          <button className="btn btn-light reset-button" type="button" onClick={resetAll}>
            Reset All
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;