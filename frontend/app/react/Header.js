/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable global-require */


import React, { Component } from 'react'
import { StyledHeader
       , StyledCloseButton } from './styles.js'


class Header extends Component {
  constructor({ close, text }) {
    super()
    this.close = close
    this.text = text
  }


  render() {
    return (
      <StyledHeader>
        {this.text}
        <StyledCloseButton
          onMouseUp={this.close}
        />
      </StyledHeader>
    )
  }
}

export default Header
