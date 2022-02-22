import React, { useEffect, useState } from 'react'
import './App.css'
import { gameSubject, initGame, resetGame } from './Game'
import Board from './Board'

function App() {
  const [board, setBoard] = useState([])
  const [isGameOver, setIsGameOver] = useState()
  const [result, setResult] = useState()
  const [turn, setTurn] = useState()
  useEffect(() => {
    initGame()
    const subscribe = gameSubject.subscribe((game) => {
      setBoard(game.board)
      setIsGameOver(game.isGameOver)
      setResult(game.result)
      setTurn(game.turn)
      
    })

    /*
    
              {turn==="b" && (
          <button className="turnb" >
          <span className="horizontal-textb">Turn: B</span>
        </button>
      )}

        {turn==="w" && (
          <button className="turnw" >
          <span className="horizontal-textw">Turn: W</span>
        </button>
      )}
    */
    return () => subscribe.unsubscribe()
  }, [])
  return (
    <div className="container">
          



  
  
          

          <button className="btn" onClick={resetGame}>
            <span className="vertical-text">RESET</span>
          </button>


          

      <div >
      <script src="SortingVisualizer.jsx"></script>
    	<h1 className="header1"> Chess Artificial Intelligence: </h1>
      <h1 className="header2"> Weighted Minimax with IDDFS and Alpha Beta Pruning </h1>
      <p className="p1"> Julian Jones </p>

      {isGameOver && (
        <h2 className="vertical-text2">
         {result && <h2 >{result}</h2>}

        </h2>
      )}
      
    
      <div className="board-container">
        <Board board={board} turn={turn} />
      </div>

    </div>

    </div>
  )
}

export default App
