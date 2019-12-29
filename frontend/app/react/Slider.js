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

      this.state = { value: props.value }
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
                   : Math.min(target.value, this.props.max)

      console.log("Slider", target.value, type)
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

      console.log("Display: value", this.state.value, "display", display)

      return display
    }


    _getValueFromSliderDisplay(display) {
      const value = Math.min(
        this.props.min + (display * this.props.step)
      , this.props.max
      )

      console.log(this.props.min, this.props.max, this.props.step)
      console.log("Value: value", value, "display", display)

      return value
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