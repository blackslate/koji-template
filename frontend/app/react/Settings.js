/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable global-require */




import React, { Component } from 'react'
import Koji from '@withkoji/vcc'
import Header from './Header.js'
import { StyledSettings } from './styles.js'

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


  getButtonStyle(bgColor, checked, width, height) {
    const colors = buttonColors(bgColor)

    return {
      width
    , height
    , display:           "flex"
    , flexDirection:     "column"
    , justifyContent:    "center"
    , textAlign:         "center"
    //, margin:            "0 auto"

    , fontFamily:        this.titleFont
    , color:             Koji.config.colors.textColor
    , fontSize:          this.skin.buttonFontSize + "vmin"

    , borderWidth:       this.skin.borderWidth+"vmin"
    , borderStyle:       "solid"
    , boxSizing:         "border-box"
    // CUSTOM COLORS FOR BACKGROUND AND BORDER
    , borderColor:       checked ? colors.downShade : colors.restTint
    , borderRightColor:  checked ? colors.downTint  : colors.restShade
    , borderBottomColor: checked ? colors.downTint  : colors.restShade
    , borderRadius:      this.skin.borderRadius+"vmin"
    , backgroundColor:   checked ? colors.downBg: bgColor
    }
  }


  getTextButton({ name, onClick }, style) {

  }


  getIconButton({ icon, onClick }, style) {

  }


  getDualButton({ name, icon, onClick, onChange }, style) {
    return (
      <div
        key={name}
        style={style}
        onChange={onChange}
        onClick={onClick}
      >
        <img
          width="82%"
          style={{margin: "0 auto"}}
          src={icon}
        />
        <p>{name}</p>
      </div>
    )
  }


  getButtonContents(itemData, style) {
    // const { name, tooltip, icon, bgColor } = itemData

    switch (this.skin.display) {
      case "icon":
        if (!itemData.icon) {
          return this.getTextButton(itemData, style)
        } else {
          return this.getIconButton(itemData, style)
        }

      case "text":
        if (!itemData.name) {
          return this.getIconButton(itemData, style)
        } else {
          return this.getTextButton(itemData, style)
        }

      default: // "icon&text"
        if (!itemData.name) {
          return this.getIconButton(itemData, style)
        } else if (!itemData.icon) {
          return this.getTextButton(itemData, style)
        } else {
          return this.getDualButton(itemData, style)
        }
    }
  }


  getPanelButton(panelName, index) {
    const panelData = this.panelMap[panelName]
    const uniqueKey = panelData.name
    const checked   = uniqueKey === settings.getPanel()
    const width     = this.buttonWidth
    const height    = this.buttonHeight

    const style = this.getButtonStyle(
      panelData.bgColor
    , checked
    , width
    , height
    )

    const contents = this.getButtonContents(panelData)

    return (
      <label
        key={uniqueKey}
        style={style}
        htmlFor={uniqueKey}
      >
        <input
          type="radio"
          name="settings"
          id={uniqueKey}
          value={panelData.name}
          onChange={this.change}
          checked={checked}
          style={{height: 0, opacity: 0}}
        />
        {contents}
      </label>
    )
  }


  getPanelStyle(bgColor, checked) {
    const time = this.skin.transitionTime + "ms"
    return {
      position: "absolute"
    , height: this.panelHeight
    , width:  this.panelWidth
    , left: checked ? this.buttonWidth : "-100vw"
    , top: Koji.config.text.headerHeight + "vmin"
    , backgroundColor: bgColor
    , transition: checked ? `left ${time} ${time}` : `left ${time}`
    , overflow: "auto"
    }
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

    buttonData.onClick = () => method(panelData.name, buttonData.codeName)

    const style = this.getButtonStyle(
      panelData.bgColor
    , checked
    , panelDimensions.side + "px"
    , panelDimensions.side + "px"
    )

    return this.getButtonContents(buttonData, style)
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
    
    const style = {
      display: "flex"
    , flexDirection: panelDimensions.vertical ? "column" : "row"
    , justifyContent: "space-evenly"
    , alignItems: "center"
    , width: width + "px"
    , height: height + "px"
    }

    return (
      <div
        className={"selection " + name}
        style={style}
      >
        {contents}
      </div>
    )
  }


  getContents(panelData, panelDimensions, method) {
    const { options, name, type } = panelData
    const contents = options.map( optionName => {
      switch (type) {
        case "selection":
          return this.customizeButton(
            optionName
          , panelData
          , panelDimensions
          , method)

        case "value":
          return ""
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
    const style = this.getPanelStyle(bgColor, checked)

    return (
      <div
        key={name}
        style={style}
      >
        {contents}
      </div>
    )
  }


  getItems() {
    // Ordered array of names of panels
    const buttonSet = this.panels.map(this.getPanelButton)
    const panelSet  = this.panels.map(this.getSettingsPanel)

    return (
      <div
        style={{
          display: "flex"
        , flexDirection: "column"
        , height: this.panelHeight
        }}
      >
        {panelSet}
        <div
          style={{
            position: "absolute"
          , top: Koji.config.text.headerHeight + "vmin"
          , left: 0
          }}
        >
          {buttonSet}
        </div>
      </div>
    )
  }


  render() {
    const items = this.getItems()

    return (
      <StyledSettings>
        <Header
          text={this.skin.title}
          close={this.setView}
        />
        {items}
      </StyledSettings>
    )
  }
}

export default Settings
