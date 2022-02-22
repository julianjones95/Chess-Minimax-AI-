import * as Chess from 'chess.js'
import * as Chessvirtual from 'chess.js'
import { BehaviorSubject } from 'rxjs'


                                    //creates overarching rules for gameset and sets movement with chess libraries
const chess = new Chess()           //creates new game of chess from our chess library
const chessvirtual = new Chessvirtual()

export const gameSubject = new BehaviorSubject()

export function initGame() {
    const savedGame = localStorage.getItem('savedGame') // saves game in local memory
    if (savedGame) {
        chess.load(savedGame)
        chessvirtual.load(savedGame)
    }
    updateGame()
}

export function resetGame() {
    chess.reset()
    chessvirtual.reset()
    updateGame()
}

export function handleMove(from, to) {                  //handles movement of pieces
    const promotions = chess.moves({ verbose: true }).filter(m => m.promotion)
    console.table(promotions)
    if (promotions.some(p => `${p.from}:${p.to}` === `${from}:${to}`)) {
        const pendingPromotion = { from, to, color: promotions[0].color }
        updateGame(pendingPromotion)
    }
    const { pendingPromotion } = gameSubject.getValue()

    if (!pendingPromotion  && (chess.turn()==='w')) {   // allows user to move strictly white pieces
        move(from, to)
        virtualmove(from,to)
    }
 

    else if (!pendingPromotion  && (chess.turn()==='b')) {   // allows user to move strictly black pieces
       let depth = 3;        // anything past depth 3 becomes very slow 
       let searchspace = 10;        //number of pieces the heuristic generates focus on (whole space is 16)
       let score=0;
       let tscore=0;        // gets the score at the top nodes in the tree
       let maxscore=-10000;
       let minscore=10000;
       let output=[]
       

       //if(movetoken===0){
       console.time("minimax runtime");
       output=minimax(depth,true,-100000,100000,score,maxscore,minscore,tscore,searchspace)
       console.log(output[0])
       console.timeEnd("minimax runtime");
       move(output[1],output[2])
       virtualmove(output[1],output[2])
       //}
    }
    

}
export function findking(){

    for(let i =0; i<8; i++){                //begins the maximization loop to find max piece
                
        const letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][i]
        for(let j=1 ; j<9 ; j++){
            let position=JSON.stringify(chessvirtual.get(letter+j))
                                                                        //console.log(chess.get("a1"))
                                                                        //console.log(position.includes('b'))
            if(position.includes('"b"',12)){        //identifies the piece we want to move
                console.log(position)
            }
        }
    }
    

}

export function searchheuristic(depth,maxormin,searchspace1){                //(depth 1 search)


    if(maxormin===true){
        let input=[]

            for(let r=0; r<=1 ; r++){
          //      let values =['"k"','"q"','"r"','"b"','"n"','"p"',"null"]
                        
            for(let i =0; i<8; i++){                //begins the maximization loop to find max piece
                
                const letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][i]
                for(let j=1 ; j<9 ; j++){
                    let position=JSON.stringify(chessvirtual.get(letter+j))
                                                                                //console.log(chess.get("a1"))
                                                                                //console.log(position.includes('b'))
                    if(position.includes('"b"',12)){        //identifies the piece we want to move
                        let from =(letter+j)
                        let posmoves=JSON.stringify(chessvirtual.moves({ square: (from)})) 


                        for(let k =0; k<8; k++){
                        
                            const letterto = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][k]
                            for(let l=1 ; l<9 ; l++){
                            
                            let to =(letterto+l)                              //identifies the position we want to move to                            //console.log(chess.get("a1"))
                                                                                 
                            if(posmoves.includes(to)){
                                    let capturespace=JSON.stringify(chessvirtual.get(to))

                                       // if(capturespace.includes(values[p])){
                                        if(!capturespace.includes("null")&&r===0){                                  

                                            if(input.includes(from)===false){
                                            input.push(from)
                                        }
                                    }
                                        }
                                        else if(r===1){
                                            if(input.includes(from)===false){
                                                input.push(from)
                                        }
                                            
                                    }

                                }

                            }

                        }

                    }

                }
                
            }
            return input
        }     
    
    
    else if(maxormin===false){
        let input=[]
       // let spacetoken=0;
        for(let r=0;r<=1;r++){
            



            for(let i =0; i<8; i++){                //begins the maximization loop to find max piece
                
                const letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][i]
                for(let j=1 ; j<9 ; j++){
                    let position=JSON.stringify(chessvirtual.get(letter+j))

                    if(position.includes('"w"',12)){        //identifies the piece we want to move is the right color
                        let from =(letter+j)
                        let posmoves=JSON.stringify(chessvirtual.moves({ square: (from)})) 
                       
                        for(let k =0; k<8; k++){

                        
                            const letterto = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][k]
                            for(let l=1 ; l<9 ; l++){
                            
                            let to =(letterto+l)                              //identifies the position we want to move to  

                            if(posmoves.includes(to)){
                                let capturespace=JSON.stringify(chessvirtual.get(to))

                                   // if(capturespace.includes(values[p])){
                                    if(!capturespace.includes("null")&&r===0){                                  

                                        if(input.includes(from)===false){
                                        input.push(from)
                                    }
                                    }
                                    }

                                    else if(r===1){
                                        if(input.includes(from)===false){
                                            input.push(from)
                                    }
                                        

                                }
                        
                    
                            }


                        }


                    }


                }


            }


        }
        return input

    }   


}

export function findoutput(depth,maxormin,searchspace1){                //(depth 1 search)


    if(maxormin===true){
        let input=[]

            for(let r=0; r<=1 ; r++){
          //      let values =['"k"','"q"','"r"','"b"','"n"','"p"',"null"]
                        
            for(let i =0; i<8; i++){                //begins the maximization loop to find max piece
                
                const letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][i]
                for(let j=1 ; j<9 ; j++){
                    let position=JSON.stringify(chessvirtual.get(letter+j))
                                                                                //console.log(chess.get("a1"))
                                                                                //console.log(position.includes('b'))
                    if(position.includes('"b"',12)){        //identifies the piece we want to move
                        let from =(letter+j)
                        let posmoves=JSON.stringify(chessvirtual.moves({ square: (from)})) 


                        for(let k =0; k<8; k++){
                        
                            const letterto = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][k]
                            for(let l=1 ; l<9 ; l++){
                            
                            let to =(letterto+l)                              //identifies the position we want to move to                            //console.log(chess.get("a1"))
                                                                                 
                            if(posmoves.includes(to)){
                                    let capturespace=JSON.stringify(chessvirtual.get(to))

                                       // if(capturespace.includes(values[p])){
                                        if(!capturespace.includes("null")&&r===0){                                  

                                            if(input.includes(from)===false){
                                            input.push(from)
                                        }
                                    }
                                        }
                                        else if(r===1){
                                            if(input.includes(from)===false){
                                                input.push(from)
                                        }
                                            
                                    }

                                }

                            }

                        }

                    }

                }
                
            }
            return input
        }     
    
    
    else if(maxormin===false){
        let whiteoutput=[]
       // let spacetoken=0;

            



            for(let i =0; i<8; i++){                //begins the maximization loop to find max piece
                
                const letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][i]
                for(let j=1 ; j<9 ; j++){
                    let position=JSON.stringify(chessvirtual.get(letter+j))

                    if(position.includes('"w"',12)){        //identifies the piece we want to move is the right color
                        let from =(letter+j)
                        let posmoves=JSON.stringify(chessvirtual.moves({ square: (from)})) 
                       
                        for(let k =0; k<8; k++){

                        
                            const letterto = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][k]
                            for(let l=1 ; l<9 ; l++){
                            
                            let to =(letterto+l)                              //identifies the position we want to move to  

                            if(posmoves.includes(to)){
                                let capturespace=JSON.stringify(chessvirtual.get(to))

                                   // if(capturespace.includes(values[p])){
                                    if(!capturespace.includes("null")){                                  

                                        if(whiteoutput.includes(to)===false){
                                        whiteoutput.push(to)
                                    }
                                    }
                                    


                                        

                                }
                        
                    
                            }


                        }


                    }


                }


            


        }
//        console.log(whiteoutput)
        return whiteoutput

    }   


}

export function searchheuristic2(searchdepth,maxormin,alpha,beta,score,maxscore,minscore,tscore,searchspace2){               //(depth 2 search)
//this heuristic uses the absolute values of captured pieces 2 moves ahead to decide which pieces to focus on
    searchspace2=10              //needs to declare because of recursion input
    let spacetoken=0;
    let input2=[]                   

    
//    console.log(chess.ascii())
//   console.log(chessvirtual.ascii())
        
       if(maxormin===true){             //runs maximizing function   
        let input=searchheuristic(1,true,10)
            while(input2.length<(searchspace2) && (spacetoken===0)){

            for(let p=0; p<=4 ; p++){
                let values =[30,-30,5,-5,0]
                for(let i =0; i<input.length; i++){ 
                let from =input[i]
                let posmoves=JSON.stringify(chessvirtual.moves({ square: (from)}))

                 

                    for(let k =0; k<8; k++){
                    
                        const letterto = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][k]
                        for(let l=1 ; l<9 ; l++){
                        
                        let to =(letterto+l)                              //identifies the position we want to move to                            //console.log(chess.get("a1"))
                                                       
                            if(posmoves.includes(to)){        // verifies valid possible moves we can move to
                                 if((searchdepth-1)===0){



                                 if (score>=maxscore){          //finds max score if depth is 0 else calls recursion
                                    maxscore=score;

                                }

                                }
                                else if (maxormin===true){          //calls a minimizing function
//                                    
                                    let capturespace=JSON.stringify(chessvirtual.get(to))

                                                if(capturespace.includes('"k"')){
                                                tscore=300;
                                                }
                                                if(capturespace.includes('"q"')){
                                                tscore=90;
                                                }
                                                else if(capturespace.includes('"r"')){
                                                tscore=50;
                                                }
                                                else if(capturespace.includes('"b"')){
                                                tscore=40;
                                                }
                                                else if(capturespace.includes('"n"')){
                                                tscore=30;
                                                }
                                                else if(capturespace.includes('"p"')){
                                                tscore=10;
                                                }
                                                else if(capturespace.includes("null")){
                                                tscore=0;
                                                }
//                                    
                                    virtualmove(from,to)
                                      
                                    score=searchheuristic2(searchdepth-1,false,alpha,beta)//runs a minimization function                                    
                                    score=score+tscore
                                    chessvirtual.undo()
                                      
                                if(values[p]>=0){
                                if (score>=values[p]){       //finds the max of the minimum
                                        if(input2.includes(from)===false){
                                        input2.push(from)
//d                                        console.log("pos score: "+ score + "values:" +values[p] + "from: "+ from)

                                    }}

                                    if (score>=alpha){       //finds out if our alpha value should be set
                                    alpha=score;
                                    }  
                                    if (beta<=alpha){
                                        break
                                    }
                                }
                                
                                else if(values[p]<0){
                                if (score<=values[p]&& tscore>0){       //finds the max of the minimum
                                if(input2.includes(from)===false){
                                input2.push(from)
//d                                console.log("neg score: " + score + "values:" +values[p]+ "to: " + from)

                                }}
                                else if (score<=values[p]&& tscore===0){       //finds the max of the minimum
                                    if(input2.includes(from)===false){
                                        input2.push(from)
                        /*                for(let i =0; i<whiteinput.length; i++){ 
                                 
                                                    let whitefrom = whiteinput[i]
                                                    console.log("current turn"+chessvirtual.turn())
                                                    let poswmoves=JSON.stringify(chessvirtual.moves({ square: (whitefrom)}))  
                                                    console.log("wh from" + whitefrom)
                                                    console.log("ps moves" + poswmoves)
                                                    if(input2.includes(from)===false){
                                                        if(poswmoves.includes(from)===true){
                                                            console.log("from space:" +from)

                                                        }
                                                        
                                                    }
                                                    } */
                                                
                                                }
                                                                                        }
//d                                   console.log("(no output) neg score: "+ score + "values:" +values[p]+ "to: " + from)

                                
                                 if (score>=alpha){       //finds out if our alpha value should be set
                                    alpha=score;
                                 }  
                                 if (beta<=alpha){
                                     break
                                 }
                               
                                 
                                }
                            

                            }


                        }


                    }


                }
            
            
            }


        }
        
        spacetoken=1
        }
        console.log("depth 1" + input)
        console.log("depth 2" + input2)

        return input2
    }
    else if(maxormin===false) {             //runs minimizing function   

        minscore=100000;
        for(let i =0; i<8; i++){                //begins the maximization loop to find max piece
                
            const letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][i]
            for(let j=1 ; j<9 ; j++){
                let position=JSON.stringify(chessvirtual.get(letter+j))
                                                                            //console.log(chess.get("a1"))
                                                                            //console.log(position.includes('b'))
                if(position.includes('"w"',12)){        //identifies the piece we want to move
                    let from =(letter+j)
                    
                    let posmoves=JSON.stringify(chessvirtual.moves({ square: (from)}))                     

                    for(let k =0; k<8; k++){
                    
                        const letterto = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][k]
                        for(let l=1 ; l<9 ; l++){
                        
                        let to =(letterto+l)                              //identifies the position we want to move to                            //console.log(chess.get("a1"))
                        
                        if(posmoves.includes(to)){        // verifies valid possible moves we can move to
                                 if((searchdepth-1)===0){
                                 let capturespace=JSON.stringify(chessvirtual.get(to))
                                 
                                if(capturespace.includes('"type":"k"')){
                                    score=-295;
                                }
                                if(capturespace.includes('"type":"q"')){
                                    score=-85;
                                }
                                else if(capturespace.includes('"type":"r"')){
                                    score=-45;
                                }
                                else if(capturespace.includes('"type":"b"')){
                                    score=-35;
                                }
                                else if(capturespace.includes('"type":"n"')){
                                    score=-25;
                                }
                                else if(capturespace.includes('"type":"p"')){
                                    score=-5;
                                }
                                else if(capturespace.includes("null")){
                                    score=0;
                                }
                                
//                                console.log(capturespace)
                                                           // calls for a maximizing function
/*
                                    virtualmove(from,to)
                                    score=searchheuristic2(searchdepth-1,true,alpha,beta)[0]         // calls a max function
                                    console.log("score" + score)
                                    score= score + tscore
                                    chessvirtual.undo()
*/
                                    if (score<=minscore){                       //minimizes a maximum
                                        minscore=score;
                                    }
                                    if (score<=beta){       //finds out if our beta value should be set or is less than current score
                                        beta=score;
                                    }  
                                     if (beta<=alpha){
                                        
                                        break
                                    }
                                }



                            }


                        }


                    }


                }


            }


        }

        return minscore
    }


}
    
    

export function minimax(depth,maxormin,alpha,beta,score,maxscore,minscore,tscore,searchspace,input){
   

//    console.log(chess.ascii())
//   console.log(chessvirtual.ascii())
    searchspace=10              //needs to declare because of recursion input
    let maxmovementbegin ="";
    let maxmovementend ="";
       if(maxormin===true){             //runs maximizing function   

        

        maxscore=-100000;
        if(depth===3){
            console.log("inside depth" + depth)
            console.time("searchheuristic runtime");
            input= searchheuristic2(2,true,-100000,100000,score,maxscore,minscore,tscore,searchspace)
            console.timeEnd("searchheuristic runtime");
        }
        else{
//        console.time("baseheuristic runtime");
        input= searchheuristic(depth,true,searchspace)
//        console.timeEnd("baseheuristic runtime");
        console.log("depth is: "+depth)
        }
        for(let i =0; i<searchspace; i++){ 
                    //console.log(input)
                    let from =input[i]
                    let posmoves=JSON.stringify(chessvirtual.moves({ square: (from)}))   

                    for(let k =0; k<8; k++){
                    
                        const letterto = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][k]
                        for(let l=1 ; l<9 ; l++){
                        
                        let to =(letterto+l)                              //identifies the position we want to move to                            //console.log(chess.get("a1"))
                                                       
                            if(posmoves.includes(to)){        // verifies valid possible moves we can move to
                                 if((depth-1)===0){

                                 
                                 let capturespace=JSON.stringify(chessvirtual.get(to))
                                 if(capturespace.includes('"k"')){
                                    score=300;
                                 }
                                 if(capturespace.includes('"q"')){
                                    score=90;
                                 }
                                 else if(capturespace.includes('"r"')){
                                    score=50;
                                 }
                                 else if(capturespace.includes('"b"')){
                                    score=40;
                                 }
                                 else if(capturespace.includes('"n"')){
                                    score=30;
                                 }
                                 else if(capturespace.includes('"p"')){
                                    score=10;
                                 }
                                 else if(capturespace.includes("null")){
                                    score=0;
                                 }


                                 if (score>=maxscore){          //finds max score if depth is 0 else calls recursion
                                    maxscore=score;
                                    maxmovementbegin=from;
                                    maxmovementend=to;  
                                }

                                }
                                else if (maxormin===true){          //calls a minimizing function
//                                    
                                    let capturespace=JSON.stringify(chessvirtual.get(to))
                                
                                                if(capturespace.includes('"k"')){
                                                tscore=300;
                                                }
                                                if(capturespace.includes('"q"')){
                                                tscore=90;
                                                }
                                                else if(capturespace.includes('"r"')){
                                                tscore=50;
                                                }
                                                else if(capturespace.includes('"b"')){
                                                tscore=40;
                                                }
                                                else if(capturespace.includes('"n"')){
                                                tscore=30;
                                                }
                                                else if(capturespace.includes('"p"')){
                                                tscore=10;
                                                }
                                                else if(capturespace.includes("null")){
                                                tscore=0;
                                                }
//                                    
                                    virtualmove(from,to)
                                    score=minimax(depth-1,false,alpha,beta)   //runs a minimization function
                                    score=score+tscore
                                    chessvirtual.undo()
                                    if (score>=maxscore){       //finds the max of the minimum
                                        maxscore=score;
                                        maxmovementbegin=from;
                                        maxmovementend=to;

                                     }     
                                     if (score>=alpha){       //finds out if our alpha value should be set
                                        alpha=score;
                                     }  
                                     if (beta<=alpha){
                                         break
                                     }
                                }
  
                            }

                        }

                    }



        }
        
        return [maxscore,maxmovementbegin,maxmovementend]
    }
    else if(maxormin===false) {             //runs minimizing function   
        
        minscore=100000;
        let input= searchheuristic(depth,false,searchspace)

        for(let i =0; i<searchspace; i++){ 
 
                    let from = input[i]
                    let posmoves=JSON.stringify(chessvirtual.moves({ square: (from)}))                  

                    for(let k =0; k<8; k++){
                    
                        const letterto = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][k]
                        for(let l=1 ; l<9 ; l++){
                        
                        let to =(letterto+l)                              //identifies the position we want to move to                            //console.log(chess.get("a1"))
                                                         
                            if(posmoves.includes(to)){        // verifies valid possible moves we can move to
                                 if((depth-1)===0){
                                 
                                 
                                 let capturespace=JSON.stringify(chessvirtual.get(to))
                                 
                                 
                                if(capturespace.includes('"type":"k"')){
                                    score=-300;
                                }
                                if(capturespace.includes('"type":"q"')){
                                    score=-90;
                                }
                                else if(capturespace.includes('"type":"r"')){
                                    score=-50;
                                }
                                else if(capturespace.includes('"type":"b"')){
                                    score=-40;
                                }
                                else if(capturespace.includes('"type":"n"')){
                                    score=-30;
                                }
                                else if(capturespace.includes('"type":"p"')){
                                    score=-10;
                                }
                                else if(capturespace.includes("null")){
                                    score=0;
                                }

                                if (score<=minscore){
                                    minscore=score;
                                }

                                 
                                }
                                else{                           // calls for a maximizing function
                                    let capturespace=JSON.stringify(chessvirtual.get(to))
                                    if(capturespace.includes('"type":"k"')){
                                    tscore=-300;
                                    }
                                    if(capturespace.includes('"type":"q"')){
                                    tscore=-90;
                                    }
                                    else if(capturespace.includes('"type":"r"')){
                                    tscore=-50;
                                    }
                                    else if(capturespace.includes('"type":"b"')){
                                    tscore=-40;
                                    }
                                    else if(capturespace.includes('"type":"n"')){
                                    tscore=-30;
                                    }
                                    else if(capturespace.includes('"type":"p"')){
                                    tscore=-10;
                                    }
                                    else if(capturespace.includes("null")){
                                    tscore=0;
                                    }


                                    virtualmove(from,to)
                                    score=minimax(depth-1,true,alpha,beta)[0]         // calls a max function
                                    score= score + tscore
                                    chessvirtual.undo()

                                    if (score<=minscore){                       //minimizes a maximum
                                        minscore=score;
                                    }
                                    if (score<=beta){       //finds out if our beta value should be set or is less than current score
                                        beta=score;
                                    }  
                                     if (beta<=alpha){
                                        
                                        break
                                    }


                                }


                            }


                        }


                    }


                }




        return minscore 
        
    }


}






export function move(from, to, promotion) {             // movement function declaration
    
    let tempMove = { from, to }                         // stores movement request in temp move
    if (promotion) {
        tempMove.promotion = promotion
    }
    const legalMove = chess.move(tempMove)              // checks if the move is legal
    
    
    if (legalMove) {                                    
        updateGame()
    }
}

export function virtualmove(from, to, promotion) {             // movement function declaration
    
    let tempMove = { from, to }                         // stores movement request in temp move
    if (promotion) {
        tempMove.promotion = promotion
    }
    const legalMove = chessvirtual.move(tempMove)              // checks if the move is legal
    
    if (legalMove) {                                    
        updateGame()
    }
}

function updateGame(pendingPromotion) {
    const isGameOver = chess.game_over()

    const newGame = {
        board: chess.board(),           // creates and initializes the chess board
        pendingPromotion,
        isGameOver,
        turn: chess.turn(),                 //declares turn function returns w or b for white or black
        result: isGameOver ? getGameResult() : null
    }

    localStorage.setItem('savedGame', chess.fen())

    gameSubject.next(newGame)
}



function getGameResult() {
    if (chess.in_checkmate()) {
        const winner = chess.turn() === "w" ? 'BLACK' : 'WHITE'
        return `CHECKMATE - WINNER - ${winner}`
    } else if (chess.in_draw()) {
        let reason = '50 - MOVES - RULE'
        if (chess.in_stalemate()) {
            reason = 'STALEMATE'
        } else if (chess.in_threefold_repetition()) {
            reason = 'REPETITION'
        } else if (chess.insufficient_material()) {
            reason = "INSUFFICIENT MATERIAL"
        }
        return `DRAW - ${reason}`
    } else {
        return 'UNKNOWN REASON'
    }
}