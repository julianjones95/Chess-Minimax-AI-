import React, { useEffect, useState } from 'react'
import BoardSquare from './BoardSquare'
export default function Board({ board, turn }) {  //CREATES THE BOARD
  const [currBoard, setCurrBoard] = useState([])

  useEffect(() => {
    setCurrBoard(                                   //Sets current board makes sure array is flat 
      turn === 'w' ? board.flat() : board.flat()
    )
  }, [board, turn])

  function getXYPosition(i) {                       // gets the position of the piece
    
    const x = i % 8                                // translates the position
    const y = Math.abs(Math.floor(i / 8) - 7)
    
  
    return { x, y }
    
  }

  function isBlack(i) {                             // Creates checkerboard pattern
    
    const { x, y } = getXYPosition(i)
    return (x + y) % 2 === 1
  }

  function getPosition(i) {
    const { x, y } = getXYPosition(i)
    const letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][
      x
    ]
    return `${letter}${y + 1}`
  }
  return (
    <div className="board">
      {currBoard.map((piece, i) => (      //maps each piece out and assigns it to a <div
        <div key={i} className="square">  
          <BoardSquare
            piece={piece}
            black={isBlack(i)}
            position={getPosition(i)}
          />

        </div>
      ))}
    </div>
  )
}