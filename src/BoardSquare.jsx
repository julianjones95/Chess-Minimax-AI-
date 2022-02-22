
import React, { useEffect, useState } from 'react'
import Square from './Square'
import Piece from './Piece'
import { useDrop } from 'react-dnd'               // drop component from drag and drop library
import { handleMove } from './Game'
import { gameSubject } from './Game'
import Promote from './Promote'
export default function BoardSquare({piece,black,position,}) {


  const [promotion, setPromotion] = useState(null)

  const [, drop] = useDrop({
    accept: 'piece',
    drop: (item) => {
      
      const [fromPosition] = item.id.split('_')
      handleMove(fromPosition, position)                  // gets the location the piece was dropped to
      handleMove("e8", "e8")                              // moves king from and to the same spot
    },
    

    
  })



  useEffect(() => {
    const subscribe = gameSubject.subscribe(
      ({ pendingPromotion }) =>
        pendingPromotion && pendingPromotion.to === position
          ? setPromotion(pendingPromotion)
          : setPromotion(null)
    )
    return () => subscribe.unsubscribe()
    
  }, [position])
  


  return (
    
    <React.Fragment>
    <div className="board-square" ref={drop}>
      <Square black={black}>
        {promotion ? (
          <Promote promotion={promotion} />
        ) : piece ? (
          <Piece piece={piece} position={position} />
        ) : null}
      </Square>
    </div>
    </React.Fragment>
    
  )
  
  
}