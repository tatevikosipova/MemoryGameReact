import React from 'react'
import propTypes from 'prop-types'

import './GuessCount.css'

const GuessCount = ({guesses}) => <div className="guesses">{guesses}</div>

GuessCount.propTypes = {
    guesses : propTypes.number.isRequired
}

export default GuessCount