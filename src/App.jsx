import {useState,useEffect} from 'react'
import './App.css'
import languages from './assets/langauges'
import {getFarewellText} from './utils.js'
import Confetti from 'react-confetti'

function App() {

  const[word,setWord] = useState("")
  const keyletters = 'abcdefghijklmnopqrstuvwxyz'
  const[guessedwords,setguessedwords] = useState([])
  const[hintIndex, setHintIndex] = useState([]) // Add this line
  const[newgame,setnewgame] = useState(false)
  const gameLost = wrongArr.length == languages.length -1
  const gameOver = gameLost || isGamewon;
  const  lastGuessedLetter = guessedwords[guessedwords.length -1]
  const lastGuessedLetterIncorrect = lastGuessedLetter && !word.toUpperCase().includes(lastGuessedLetter)
  const isGamewon = word.length > 0 && word.toUpperCase().split("").map((letter)=>(guessedwords.includes(letter)
  )).every(isGuessed => isGuessed === true)
  const wrongArr =  guessedwords.filter(wrd=>(
      !word.toUpperCase().split("").includes(wrd)
  ))

   useEffect(()=>{
     const randomno = Math.floor(Math.random() * 4) + 4;
     fetch(`https://random-word-api.herokuapp.com/word?length=${randomno} `).then
      (response => response.json()).then
      (data => {
     setWord(data[0])
     // Generate 2 unique random hint indices
     const hintIndices = [];
     while (hintIndices.length < 2 && data[0].length > 1) {
       const idx = Math.floor(Math.random() * data[0].length);
       if (!hintIndices.includes(idx)) {
         hintIndices.push(idx);
       }
     }
     setHintIndex(hintIndices);
      const hintCharacters = hintIndices.map(index => data[0].toUpperCase().charAt(index)); 
         setguessedwords(prev => [...prev, ...hintCharacters]); // Set random hint indices
   })
   
 
  },[newgame])

  function addletter(letter){
      setguessedwords(prev => (
        !prev.includes(letter) ?[...prev,
          letter
        ]: prev
      ))
  }

  function resetGame(){
    setguessedwords([])
    setnewgame(!newgame)
  }

  function gamestatus(){
    if(gameOver){
      if(isGamewon){
        return <><h2>You win!</h2>
      <p>Well done! 🎉</p></>
      }else{
        return <><h2>Game over!</h2>
      <p>You lose! Better start learning Assembly 😭</p></>
      }
    }else if(lastGuessedLetterIncorrect && !gameOver && wrongArr.length > 0){
        return <p>{getFarewellText(languages[wrongArr.length -1].name)}</p>
    }
    else return null
  }

  function backgroundColor(){
    if(isGamewon){
      return"#10A95B"
    }
     else if(gameLost){
      return "#BA2A2A"
     }
     else if(lastGuessedLetterIncorrect){
      return "#7A5EA7"
     }
     else return null
  }
  
  function langaugechips(){
   return languages.map((language,index)=>(
        <span 
          className={wrongArr.length <= index?"chip":"chip lost"}
          style={{
          backgroundColor: language.backgroundColor, 
          color: language.color
        }} key={index}>{language.name}</span>
      ))
  }
function displayword(){
  return word.toUpperCase().split("").map((wrd,index)=>{
    const isHintCharacter = hintIndex.includes(index);
    const shouldShowCharacter = guessedwords.includes(wrd) || isHintCharacter;
    
    return gameLost ? 
      <p 
        style={{color: guessedwords.includes(wrd)?"":"#EC5D49"}}    
        key={index}>{wrd}
      </p> :
      <p key={index}>
        {shouldShowCharacter && wrd}
      </p>
  })
}
  function keyboard(){
    return keyletters.toUpperCase().split("").map((letter)=>{
        const color =   guessedwords.includes(letter) ? word.toUpperCase().split("").includes(letter) ?"#10A95B":"#EC5D49":""
       return <button
        disabled={gameOver}
        style={{backgroundColor:color}} 
        key={letter} 
        onClick={()=>addletter(letter)}>
        {letter}
        </button>
      })
  }
  return (
    <>
  {(isGamewon && gameOver )&&<Confetti/>}
    <header>
    <h1>Assembly: Endgame</h1>
      <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
    </header>
      {<section className='gamestatus' style={{backgroundColor: backgroundColor()}}>
       {gamestatus()}
    </section>}
    <section className='wordchips'>
      {langaugechips()}
    </section>
    <section className='displayword'>
      {displayword()}
    </section>
    <section className='keyboard'>
      {keyboard()}
    </section>
    {gameOver && <button id='newgame' onClick={()=>resetGame()}>New Game</button>}
    </>
  )
}

export default App