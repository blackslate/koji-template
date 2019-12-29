/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable global-require */




import React, { Component } from 'react'
import Koji from '@withkoji/vcc'
import Header from './Header.js'
import Slider from './Slider.js'
import { StyledSettingsBackground
       , StyledSettingsPanelSet
       , StyledSettingsButtonSet
       , StyledSettingPanelDrawer
       , StyledSettingPanel
       , StyledSettingButton
       , StyledSettingButtonImage
       , StyledHiddenInput
       , StyledSettingSlider
       } from './Styles/styles.js'

import settings from '../../utilities/settings.js'
import { buttonColors
       , getFontFamily
       } from '../../utilities/utilities'



class Settings extends Component {
  constructor({ setView }) {
    super()

    this.setView = setView //function to close view (set view to Menu)

    // Bound methods
    this.change           = this.change.bind(this)
    this.getPanelButton   = this.getPanelButton.bind(this)
    this.getSettingsPanel = this.getSettingsPanel.bind(this)
    this.setZeroOrMore    = this.setZeroOrMore.bind(this)
    this.setOnlyOne       = this.setOnlyOne.bind(this)
    this.setOneOrMore     = this.setOneOrMore.bind(this)

    this.panelMap     = settings.getPanelData("panelMap")
    this.panels       = settings.getPanelData("panels")
    this.skin         = settings.getPanelData("skin")

    this.buttonWidth  = this.skin.buttonWidth + "vmin"
    this.panelWidth   = "calc(100vw - " + this.buttonWidth + ")"
    this.panelHeight  = "calc(100vh - "
                      + Koji.config.text.headerHeight + "vmin)"
    const panelCount  = this.panels.length
    this.buttonHeight = `calc(${this.panelHeight}/${panelCount})`
    this.titleFont    = getFontFamily(Koji.config.text.titleFont)

    // Layout uses px not vxxx units, so it does not adapt to changes
    // in screen dimensions. Use window.resize to force refresh.
    this.resize   = this.resize.bind(this)
    this.debounce = 200
    this.timeOut  = 0
    window.addEventListener("resize", this.resize, false)

    this.state = settings.settings
  }


  resize() {
    if (this.timeOut) {
      return
    }

    this.timeOut = setTimeout(() => {
      this.setState({ resize: this.timeOut })
      this.timeOut = 0
    }, this.debounce)
  }


  change(event) {
    settings.setPanel(event.target.id)

    this.setState({ panel: event.target.id })
  }


  itemIsSelected(key, item) {
    const array = this.state.selections[key]
    return !(array.indexOf(item) < 0)
  }


  setValue(setting, item, value) {
    // console.log( "setValue", "event:", event
    //            , "panel:", panel, "item:", item)
    // return
    const values = settings.setValue(setting, item, value)

    this.setState({ values })
  }


  setOnlyOne(setting, item) {
    const selections = settings.replaceSelection(setting, item)

    this.setState({ selections })
  }


  setZeroOrMore(setting, item) {
    const selections = settings.toggleSelection(setting, item)

    this.setState({ selections })
  }


  setOneOrMore(setting, item) {
    const selections = settings.ensureSelection(setting, item)

    this.setState({ selections })
  }


  getButton(
    { name
      , icon
      , onClick  // for buttons in the panel
      , onChange // for radio buttons on the left
      , bgColor
      , height
      , width
      , panel=false
      }
    , checked
    , ignore
    ) {

    const colors = buttonColors(bgColor)
    const contents = []
    if (!ignore.icon) {
      contents.push(
        <StyledSettingButtonImage
          src={icon}
          key="icon"
          width="75%"
        />
      )
    }

    if (!ignore.name) {
      contents.push(
        <p
          key="name"
        >
          {name}
        </p>
      )
    }

    return (
      <StyledSettingButton
        key={name}
        onChange={onChange}
        onClick={onClick}
        checked={checked}
        width={width}
        height={height}
        titleFont={this.titleFont}
        skin={this.skin}
        colors={colors}
        panel={panel}
      >
        {contents}      
      </StyledSettingButton>
    )
  }


  getButtonContents(itemData, checked) {
    const ignore = []

    switch (this.skin.display) {
      case "icon":
        if (!itemData.icon) {
          ignore.push("icon")
        } else {
          ignore.push("name")
        }

      case "text":
        if (!itemData.name) {
          ignore.push("name")
        } else {
          ignore.push("icon")
        }

      default: // "icon&text"
        if (!itemData.name) {
          ignore.push("name")
        } else if (!itemData.icon) {
          ignore.push("icon")
        }
    }

    return this.getButton(itemData, checked, ignore)
  }


  getPanelButton(panelName, index) {
    const panelData = this.panelMap[panelName]
    const uniqueKey = panelData.name
    const checked   = uniqueKey === settings.getPanel()
    const width     = this.buttonWidth
    const height    = this.buttonHeight

    panelData.width = width
    panelData.height = height
    panelData.panel = true

    const contents = this.getButtonContents(panelData, checked)

    return (
      <label
        key={uniqueKey}
        htmlFor={uniqueKey}
      >
        <StyledHiddenInput
          type="radio"
          name="settings"
          id={uniqueKey}
          value={panelData.name}
          onChange={this.change}
          checked={checked}
        />
        {contents}
      </label>
    )
  }


  getPanelDimensions(count) {
    const bodyRect     = document.body.getBoundingClientRect()
    const vmin         = Math.min(bodyRect.width, bodyRect.height)/100
    const buttonWidth  = this.skin.buttonWidth
    const headerHeight = Koji.config.text.headerHeight
    let width          = bodyRect.width - buttonWidth * vmin
    let height         = bodyRect.height - headerHeight * vmin
    const minSize      = Math.min(width, height)
    const maxSize      = Math.max(width, height)
    const vertical     = height > width
    const spacing      = this.skin.itemSpacing * minSize / 100

    let side = Math.min(
      minSize - spacing * 2
    , (maxSize - (spacing * 3)) / 2
    )

    // Allow for scrollbars if necessary
    const length = (side + spacing) * count + spacing

    if (length > maxSize) {
      if (vertical) {
        width -= 20
      } else {
        height -= 20
      }

      side = Math.min(
        minSize - spacing * 2
      , (maxSize - (spacing * 3)) / 2
      )
    }

    const panelData = {
      width
    , height
    , side
    , vertical
    , spacing
    }

    return panelData
  }


  customizeButton(buttonName, panelData, panelDimensions, method) {
    const optionData = panelData.optionData[buttonName]
    const checked    = this.itemIsSelected(panelData.name,buttonName)
    const buttonData = checked
                     ? optionData[0]
                     : optionData[optionData.length - 1]

    buttonData.onClick = () => method(
      panelData.name
    , buttonData.codeName
    )
    buttonData.bgColor = panelData.bgColor
    buttonData.width   = panelDimensions.side + "px"
    buttonData.height  = panelDimensions.side + "px"

    return this.getButtonContents(buttonData, checked)
  }


  getSliderContents({
    name
    , tooltip
    , bgColor
    , height
    , width
    , icon
    , max
    , min
    , step
    , value
    , method
    }) {

    const colors = buttonColors(bgColor)

    const contents = []
    if (icon) {
      contents.push(
        <img
          key="icon"
          src={icon}
          width="50%"
        />
      )
    }
    contents.push(
      <p
        key="name"
      >
        {name}
      </p>
    )
    contents.push(
      <Slider
        key={name}
        min={min}
        max={max}
        step={step}
        value={value}
        method={method}
      />
    )

        // onChange={onChange}
        // onClick={onClick}
        // panel={panel}

    return (
      <StyledSettingSlider
        key={name}
        value={value}
        width={width}
        height={height}
        titleFont={this.titleFont}
        skin={this.skin}
        colors={colors}
      >
        {contents}      
      </StyledSettingSlider>
    )
  }


  customizeSlider(valueName, panelData, panelDimensions, method) {
    const panelName = panelData.name
    const sliderData = panelData.optionData[valueName]
    const value = this.state.values[panelName][valueName]
    // console.log(
      // "customizeSlider"
      // , "sliderData:", sliderData
      // , "value:", value
      // , "panelData:", panelData
      // , "panelDimensions:", panelDimensions
      // , "method:", method
      // )

      // { // panelData
      //   "name":     "Numbers",
      //   "position": 1,
      //   "bgColor":  "#039",
      //   "icon":     <url>,
      //   "tooltip":  "Rotation speed & Hits required",
      //   "type":     "value",
      //   "width":    "15vmin",
      //   "height":   "calc(calc(100vh - 8vmin)/4)",
      //   "panel":    true,

      //   "optionData":{ 
      //     "Rotation speed":{ 
      //       "name":"Rotation speed",
      //       "max":60,
      //       "min":0,
      //       "step":3,
      //       "icon":"<url>",
      //       "tooltip":"Speed at which targets rotate"
      //     },
      //     "Number of hits required":{ 
      //       "name":   "Number of hits required",
      //       "max":    10,
      //       "min":    1,
      //       "step":   3,
      //       "icon":   <url>,
      //       "tooltip":"Number of times player needs to tap a target
      //                  to win a trophy"
      //     }
      //   },

      //   "options":[ 
      //     "Rotation speed",
      //     "Number of hits required"
      //   ]
      // }

      // { // panelDimensions
      //   "width":506.6
      // , "height":904.32
      // , "side":414.165
      // , "vertical":true
      // , "spacing":25.33
    // }

    sliderData.value   = value
    sliderData.method  = () => method(event, panelName, valueName)
    sliderData.bgColor = panelData.bgColor
    sliderData.width   = panelDimensions.side + "px"
    sliderData.height  = panelDimensions.side + "px"

    return this.getSliderContents(sliderData)
  }


  applyLayout(contents, panelDimensions, name) {
    const spacing = panelDimensions.spacing
    const breadth = panelDimensions.side + spacing
    const width   = panelDimensions.vertical
                  ? panelDimensions.width
                  : Math.max(
                      contents.length * breadth + spacing
                    , panelDimensions.width
                    )
    const height  = panelDimensions.vertical
                  ? Math.max(
                      contents.length * breadth + spacing
                    , panelDimensions.height
                    )
                  : panelDimensions.height

    return (
      <StyledSettingPanel
        vertical={panelDimensions.vertical}
        width={width}
        height={height}
      >
        {contents}
      </StyledSettingPanel>
    )
  }


  getContents(panelData, panelDimensions, method) {
    const { options, name, type } = panelData

    // if (name !== this.state.panel) {
    //   return ""
    // }

    const contents = options.map((optionName, index) => {
      switch (type) {
        case "selection":
          return this.customizeButton(
            optionName
          , panelData
          , panelDimensions
          , method
          )

        case "value":
          return this.customizeSlider(
            optionName
          , panelData
          , panelDimensions
          , method
          )
      }
    })

    return this.applyLayout(contents, panelDimensions, name)
  }


  getPanelContents(panelData) {
    const count = panelData.options.length
    const panelDimensions = this.getPanelDimensions(count)
    const methodName = panelData.mode
                     ? "set"
                       + panelData.mode[0].toUpperCase()
                       + panelData.mode.substring(1)
                     : "setValue"
    const method = this[methodName] || function() {} // fail silently

    return this.getContents(panelData, panelDimensions, method)
  }


  getSettingsPanel(panelName) {
    const panelData = this.panelMap[panelName]
    const { name, bgColor } = panelData
    const checked = name === settings.getPanel()
    const contents = this.getPanelContents(panelData)

    return (
      <StyledSettingPanelDrawer
        key={name}
        height={this.panelHeight}
        width={this.panelWidth}
        offset={this.buttonWidth}
        checked={checked}
        bgColor={bgColor}
        time={ this.skin.transitionTime + "ms"}
      >
        {contents}
      </StyledSettingPanelDrawer>
    )
  }


  getItems() {
    // Ordered array of names of panels
    const buttonSet = this.panels.map(this.getPanelButton)
    const panelSet  = this.panels.map(this.getSettingsPanel)

    return (
      <StyledSettingsPanelSet
        height={this.panelHeight}
      >
        {panelSet}
        <StyledSettingsButtonSet>
          {buttonSet}
        </StyledSettingsButtonSet>
      </StyledSettingsPanelSet>
    )
  }


  render() {
    const items = this.getItems()

    return (
      <StyledSettingsBackground>
        <Header
          text={this.skin.title}
          close={this.setView}
        />
        {items}
      </StyledSettingsBackground>
    )
  }
}

export default Settings
