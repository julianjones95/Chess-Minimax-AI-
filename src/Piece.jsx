import React from 'react'
import { useDrag, DragPreviewImage } from 'react-dnd'     //library used for dragging pieces

export default function Piece({piece: { type, color },position,}) 
{
  const [{ isDragging }, drag, preview] = useDrag({
    item: {
      type: 'piece',
      id: `${position}_${type}_${color}`,               //identifies the piece
    },
    collect: (monitor) => {
      return { isDragging: !!monitor.isDragging() }     // monitors active dragging
    },
  })

  
  const pieceImg = require(`./assets/${type}_${color}.png`)
  
  
  return (
    <>
      <DragPreviewImage connect={preview} src={pieceImg} />
      <div
        className="piece-container"
        ref={drag}
        style={{ opacity: isDragging ? 0.3 : 1 }}               // makes piece translucent while dragging
      >
        <img src={pieceImg} alt="" className="piece" />
      </div>
    </>
  )
}