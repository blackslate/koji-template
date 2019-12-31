/** slider.js **
 *
 *
**/



import React, { Component } from 'react'
import { StyledSlider
       , StyledNumber } from './Styles/styles.js'



class Slider extends Component {
    constructor(props) {
      super(props)

      const value = this._getValueFromNumberDisplay(props.value)
      this.state = { value }
      // this.method = props.method
      // this.object = props.object
      // this.property = props.property

      this.onChange = this.onChange.bind(this)
      this.rangeMax = Math.ceil((props.max - props.min) / props.step)
      this.numberMax = this.rangeMax * props.step + props.min
    }


    onChange(event) {
      const target = event.target
      const type = target.type.toLowerCase()
      const value = (type === "range")
                   ? this._getValueFromSliderDisplay(target.value)
                   : this._getValueFromNumberDisplay(target.value)

      this.setState({ value })
    }


    _getSliderDisplayValue() {
      let display

      if (this.state.value === this.props.max) {
        display = this.rangeMax
      } else {
        display = Math.round(
          (this.state.value - this.props.min) / this.props.step
        )
      }

      return display
    }


    _getValueFromSliderDisplay(display) {
      const value = Math.max(
        this.props.min
      , Math.min(
          this.props.min + (display * this.props.step)
        , this.props.max
        )
      )

      return value
    }


    _getValueFromNumberDisplay(display) {
      display -= this.props.min
      display = Math.round(display / this.props.step)

      return this._getValueFromSliderDisplay(display)
    }


    render() {
      return (
        <div>
          <StyledSlider
            key="range"
            type="range"
            min={0}
            max={this.rangeMax}
            value={this._getSliderDisplayValue()}
            onChange={this.onChange}
          />
          <StyledNumber
            key="number"
            type="number"
            min={this.props.min}
            max={this.numberMax}
            step={this.props.step}
            value={this.state.value}
            onChange={this.onChange}
          />
        </div>
      )
    }
  }

export default Slider