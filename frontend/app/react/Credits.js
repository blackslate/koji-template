/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable global-require */


import React, { Component } from 'react'
import Koji from '@withkoji/vcc'
import Header from './Header.js'
import { StyledCredits } from './styles.js'


class Credits extends Component {
  constructor({ setView }) {
    super()
    this.setView = setView
  }


  getCredits() {
    const items  = Koji.config.credits.credit.map((data, index) => {
     const style = (data.url.startsWith("https://fonts.google.com/"))
                 ? {fontFamily: data.name}
                 : {}

      return (
        <li
          key={index}
          style={style}
        >
          <h2><a target="credits" href={data.url}>{data.name}</a></h2>
          <p>{Koji.config.credits.by} {data.author}</p>
          <p>
            <a target="credits" href={data.licenseURL}>
              {data.license}
            </a>
          </p>
        </li>
      )
    }) 

    return items
  }


  render() {
    const credits = this.getCredits()

    return (
      <StyledCredits>
        <Header
          text={Koji.config.credits.title}
          close={this.setView}
        />
        <ul>{credits}</ul>
      </StyledCredits>
    )
  }
}

export default Credits

