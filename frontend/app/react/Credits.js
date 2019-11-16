/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable global-require */


import React, { Component } from 'react'
import { StyledCredits, StyledCloseButton } from './styles.js'


class Credits extends Component {
  constructor({ setView }) {
    super()
    this.close = setView
  }

  render() {
    return (
      <StyledCredits>
        CREDITS GO HERE
        <StyledCloseButton
          onMouseUp={this.close}
        />
      </StyledCredits>
    )
  }
}

export default Credits
