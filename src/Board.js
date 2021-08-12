import React, { useState } from "react";
import _ from "lodash"; // https://javascript.plainenglish.io/how-to-deep-copy-objects-and-arrays-in-javascript-7c911359b089

import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows, ncols, chanceLightStartsOn }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];

    // create array-of-arrays of true/false values
    for (let i = 0; i < nrows; i++) {
      initialBoard.push(Array.from({ length: ncols }, x => Math.random() < chanceLightStartsOn));
    }
    
    return initialBoard;
  }

  /**  Checks the board in state to determine whether the player has won */
  function hasWon() {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === true) {
          return false;
        }
      }
    } 
    return true;
  }

  /** Flips relevant cells around and returns updated board */
  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // Make a (deep) copy of the oldBoard
      const newBoard = _.cloneDeep(oldBoard);

      // in the copy, flip this cell and the cells around it
      for (let i = y - 1; i <= y + 1; i++) {
        for (let j = x - 1; j <= x + 1; j++) {      
          flipCell(i, j, newBoard);
        }
      }
      
      // return the copy
      return newBoard;
    });
  }
   
  /** Make table board */ 
  const tableBoard = board.map((row, y) =>
    row.map((c, x) => (
    <Cell 
      flipCellsAroundMe={ evt => flipCellsAround(`${y}-${x}`)}
      isLit={c}
      key = {`${y}-${x}`}
      />
    ))
  );
  
  /** If the game is won, show a winning msg. If not, render the board */
  return hasWon() ? (
    <div>
      <p>"Congratulations! You won."</p>
    </div>
  )
  : (
    <table>
      {tableBoard.map(row => (
      <tr>{row}</tr>
      ))} 
    </table>
  )
}

Board.defaultProps = {
  nrows: 6,
  ncols: 6,
  chanceLightStartsOn: .25
}


export default Board;

// fix dev tool errors: keys & tBody