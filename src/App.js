import React, { Component } from 'react'
import shuffle from 'lodash.shuffle'

import './App.css'

import Card from './Card'
import GuessCount from './GuessCount'
import HallOfFame, {FAKE_HOF} from './HallOfFame'
import HighScoreInput from './HighScoreInput'

const SIDE = 6
const SYMBOLS = '😀🎉💖🎩🐶🐱🦄🐬🌍🌛🌞💫🍎🍌🍓🍐🍟🍿'
const VISUAL_PAUSE_MSECS = 750

class App extends Component {

  state = {
    cards : this.generateCards(),
    currentPair : [],
    guesses : 0,
    hallOfFame : null,
    matchedCardIndices : []

  }

  //Arrow fx for binding
  displayHallOfFame = hallOfFame => {
    this.setState({hallOfFame})
  }


  /* constructor(props){
    super(props)
    this.handleCardClick = this.handleCardClick.bind(this)
  } */

  generateCards() {
    const result = []
    const size = SIDE * SIDE
    const candidates = shuffle(SYMBOLS)
    while (result.length < size) {
      const card = candidates.pop()
      result.push(card, card)
    }
    return shuffle(result)
  }

  getFeedbackForCard(index) {
    const { currentPair, matchedCardIndices } = this.state
    const indexMatched = matchedCardIndices.includes(index)
  
    if (currentPair.length < 2) {
      return indexMatched || index === currentPair[0] ? 'visible' : 'hidden'
    }
  
    if (currentPair.includes(index)) {
      return indexMatched ? 'justMatched' : 'justMismatched'
    }
  
    return indexMatched ? 'visible' : 'hidden'
  }

// Arrow fx for binding
handleCardClick = index => {
  const { currentPair } = this.state

  if (currentPair.length === 2) {
    return
  }

  if (currentPair.length === 0) {
    this.setState({ currentPair: [index] })
    return
  }

  this.handleNewPairClosedBy(index)
}

handleNewPairClosedBy(index) {
  const { cards, currentPair, guesses, matchedCardIndices } = this.state
  //console.log(matchedCardIndices, 'matchedCardIndices')
  //console.log(currentPair, 'currentPair')
  const newPair = [currentPair[0], index]
  //console.log(newPair, 'new pair');
  const newGuesses = guesses + 1
  //console.log(newGuesses, 'newGuesses');
  const matched = cards[newPair[0]] === cards[newPair[1]]
  this.setState({ currentPair: newPair, guesses: newGuesses })
  if (matched) {
    this.setState({ matchedCardIndices: [...matchedCardIndices, ...newPair] })
  }
  setTimeout(() => this.setState({ currentPair: [] }), VISUAL_PAUSE_MSECS)
}

  render() {
    const {cards, guesses, hallOfFame, matchedCardIndices} = this.state
    const won = matchedCardIndices.length === cards.length //4
    return (
      <div className="memory">
        <GuessCount  guesses={guesses}/>
        {cards.map((card, index) => (
          <Card key={index}
                index = {index}
                card={card}
                feedback={this.getFeedbackForCard(index)}
                onClick={this.handleCardClick}
          />
        ))}
        {won && 
          (hallOfFame ? (
            <HallOfFame entries={hallOfFame}/>
          ) : (
            <HighScoreInput 
              guesses={guesses}
              onStored = {this.displayHallOfFame}
            />
          ))
        }
      </div>
    )
  }
}

export default App