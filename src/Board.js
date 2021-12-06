import React, { Component } from "react";

function Hole(props) {
  return (
    <div
      className={`Hole ${
        !props.value
          ? props.player === "Red"
            ? "player-red"
            : "player-blue"
          : ""
      }`}
    >
      <div className={props.value}></div>
    </div>
  );
}

function Slat(props) {
  return (
    <div className="Slat" onClick={() => props.handleClick()}>
      {[...Array(props.holes.length)].map((x, j) => (
        <Hole key={j} value={props.holes[j]} player={props.player}></Hole>
      ))}
    </div>
  );
}

class Board extends Component {
  state = {
    boardState: new Array(7).fill(new Array(6).fill(null)),
    playerTurn: "Blue",
    gameMode: "",
    gameSelected: false,
    winner: "",
    startTurn: "Blue",
  };

  selectedGame = (mode) => {
    const { startTurn } = this.state;
    this.setState({
      gameMode: mode,
      gameSelected: true,
      boardState: new Array(7).fill(new Array(6).fill(null)),
      startTurn: startTurn === "Red" ? "Blue" : "Red",
      playerTurn: startTurn === "Red" ? "Blue" : "Red",
    });
  };

  makeMove = (slatID) => {
    const { boardState, playerTurn } = this.state;
    const boardCopy = boardState.map(function (arr) {
      return arr.slice();
    });
    if (boardCopy[slatID].indexOf(null) !== -1) {
      let newSlat = boardCopy[slatID].reverse();
      newSlat[newSlat.indexOf(null)] = playerTurn;
      newSlat.reverse();
      this.setState({
        playerTurn: playerTurn === "Red" ? "Blue" : "Red",
        boardState: boardCopy,
      });
    }
  };

  /*Only make moves if winner doesn't exist*/
  handleClick = (slatID) => {
    if (this.state.winner === "") {
      this.makeMove(slatID);
    }
  };

  /*check the winner and make AI move IF game is in AI mode*/
  componentDidUpdate() {
    const { boardState, gameMode, playerTurn, winner } = this.state;
    let cur_winner = checkWinner(boardState);
    if (winner !== cur_winner) {
      this.setState({
        winner: cur_winner,
      });
    } else {
      if (gameMode === "ai" && playerTurn === "Blue") {
        let validMove = -1;
        while (validMove === -1) {
          let slat = Math.floor(Math.random() * 7);
          if (boardState[slat].indexOf(null) !== -1) {
            validMove = slat;
          } else {
            validMove = -1;
          }
        }
        this.makeMove(validMove);
      }
    }
  }

  render() {
    const { winner, boardState, playerTurn, gameSelected, gameMode } =
      this.state;
    /*If a winner exists display the name*/
    let winnerMessageStyle;
    if (winner !== "") {
      winnerMessageStyle = "winnerMessage appear";
    } else {
      winnerMessageStyle = "winnerMessage";
    }

    /*Contruct slats allocating column from board*/
    let slats = [...Array(boardState.length)].map((x, i) => (
      <Slat
        key={i}
        holes={boardState[i]}
        handleClick={() => this.handleClick(i)}
        player={playerTurn}
      ></Slat>
    ));

    return (
      <React.Fragment>
        {gameSelected && <div className="Board">{slats}</div>}
        {winner && <div className={winnerMessageStyle}>{winner}</div>}
        {(!gameSelected || winner !== "") && (
          <div>
            <button onClick={() => this.selectedGame("human")}>
              {gameMode === "human" ? "Restart" : "Play Human"}
            </button>
            <button onClick={() => this.selectedGame("ai")}>
              {gameMode === "ai" ? "Restart" : "Play AI"}
            </button>
          </div>
        )}
      </React.Fragment>
    );
  }
}

function checkLine(a, b, c, d) {
  return a !== null && a === b && a === c && a === d;
}

function checkWinner(bs) {
  for (let c = 0; c < 7; c++)
    for (let r = 0; r < 4; r++)
      if (checkLine(bs[c][r], bs[c][r + 1], bs[c][r + 2], bs[c][r + 3]))
        return bs[c][r] + " wins!";

  for (let r = 0; r < 6; r++)
    for (let c = 0; c < 4; c++)
      if (checkLine(bs[c][r], bs[c + 1][r], bs[c + 2][r], bs[c + 3][r]))
        return bs[c][r] + " wins!";

  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 4; c++)
      if (
        checkLine(
          bs[c][r],
          bs[c + 1][r + 1],
          bs[c + 2][r + 2],
          bs[c + 3][r + 3]
        )
      )
        return bs[c][r] + " wins!";

  for (let r = 0; r < 4; r++)
    for (let c = 3; c < 6; c++)
      if (
        checkLine(
          bs[c][r],
          bs[c - 1][r + 1],
          bs[c - 2][r + 2],
          bs[c - 3][r + 3]
        )
      )
        return bs[c][r] + " wins!";

  return "";
}

export default Board;
