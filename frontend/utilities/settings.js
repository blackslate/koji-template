import Koji from '@withkoji/vcc'
import storage from './storage.js'



class Settings{
  constructor() {
    const initialState = this._getInitialState()
    const {
      skin
    , panelMap
    , panels
    , panel
    , values
    , selections
    } = initialState

    // Unchanging
    this.panelData = {
      skin
    , panels
    , panelMap
    }

    // Dynamic
    this.settings = {
      panel
    , values
    , selections
    }

    storage.restore(this.settings)
  }


  getGameSettings() {
    return {
      values: this.settings.values
    , selections: this.settings.selections
    }
  }


  getPanelData(key) {
    return this.panelData[key]
  }


  getPanel() {
    return this.settings.panel
  }


  setPanel(panelName) {
    this.settings.panel = panelName

    this._save()
  }

  // SELECTIONS // SELECTIONS // SELECTIONS // SELECTIONS //

  replaceSelection(key, item) {
    const array = this.settings.selections[key]
               || (this.settings.selections[key] = [])
    array.length = 0
    array.push(item)

    this._save()

    return this.settings.selections
  }


  toggleSelection(key, item) {
    const array = this.settings.selections[key]
               || (this.settings.selections[key] = [])
    const index = array.indexOf(item)

    if (index < 0) {
      array.push(item)
    } else {
      array.splice(index, 1)
    }

    this._save()

    return this.settings.selections
  }


  ensureSelection(key, item) {
    const array = this.settings.selections[key]
               || (this.settings.selections[key] = [])

    if (array.length > 1 || array.indexOf(item) < 0) {
      return this.toggleSelection(key, item)
    }

    return this.settings.selections // unchanged
  }

  // VALUES // VALUES // VALUES // VALUES // VALUES // VALUES //

  getValue(key, item) {
    const array = this.settings.values[key]
    if (array) {
      return array[item]
    }
  }


  setValue(key, item, value) {
    const array = this.settings.values[key]
               || (this.settings.values[key] = {})

    array[item] = value

    this._save()

    return this.settings.values
  }

  // PRIVATE METHODS // PRIVATE METHODS // PRIVATE METHODS //

  _save() {
    storage.set(this.settings)
  }


  _getInitialState() {
    const settings   = Koji.config.settings

    // Crop-clone a separate object for properties that affect the
    // CSS. These values will not change over time.
    const {
      title           // string
    , display         // icon | text | icon&text
    , buttonWidth     // vmin size
    , buttonFontSize  // vmin size
    , settingFontSize  // vmin size
    , borderWidth     // vmin size
    , borderRadius    // vmin size
    , itemSpacing     // vmin size
    , transitionTime  // milliseconds
    } = settings

    const skin = {
      title
    , display
    , buttonWidth
    , buttonFontSize
    , settingFontSize
    , borderWidth
    , borderRadius
    , itemSpacing
    , transitionTime
    }

    // Fixed properties, used only by the Settings view
    const panels     = []
    const panelMap   = {}

    // Dynamic properties set in the Settings view, saved by the
    // storage object and used in the Game view
    const selections = {}
    const values     = {}
    let panel

    const result  = {
      skin
    , panels
    , panelMap
    , selections
    , values
    // panel will be added at the very end
    }

    // HELPER FUNCTIONS // HELPER FUNCTIONS // HELPER FUNCTIONS //

    const treatSelectionPanel = (panelData) => {
      const name       = panelData.name
      const selected   = []
      const mode       = panelData.mode || "zeroOrMore"
      const options    = []
      const optionData = {}
      panel = panel || (panelData.selected ? name : undefined)

      if (panels.indexOf(name) < 0) {
        panels.push(name)
      } else {
        console.log("Duplicate selection panel name:", name)
      }

      panelData.options.forEach( option  => {
        // { name: <string>
        // , codeName:
        // , icon:
        // , tooltip:
        // , selected: <boolean>
        // , }
        let name = option.name
        const codeName = option.codeName || (option.codeName = name)
        let data

        if (options.indexOf(codeName) < 0) {
          optionData[codeName] = data = [option]
          options.push(codeName)
          if (!name) {
            option.name = codeName
          }
          if (option.selected) {
            selected.push(codeName)
          }

        } else {
          data = optionData[codeName]
          data[1] = option
          if (!name) {
            option.name = data[0].name
          }
        }

        delete option.selected
      })


      ;(function setDefaultSelection() {

        const selectOnlyOne = () => {
          switch (selected.length) {
            case 1: // do nothing
            break
            case 0:
              selected.push(options[0])
            break
            default:
              selected.length = 1
          }
        }

        const selectFirstIfNone = () => {
          if (!selected.length) {
            selected.push(options[0])
          }
        }

        switch (mode) {
          case "onlyOne":
            selectOnlyOne()

          case "oneOrMore":
            selectFirstIfNone()

          // case "zeroOrMore":
        }

        selections[name] = selected
      })();

      delete panelData.selected
      panelData.type       = "selection"
      panelData.mode       = mode
      panelData.position   = panelData.position || 0
      panelData.bgColor    = panelData.bgColor   || "#000"
      panelData.hasMaster  = !!panelData.hasMaster
      panelData.options    = options
      panelData.optionData = optionData
      // name      \
      // tooltip    🡂 optional
      // icon      /

      panelMap[name] = panelData
    }


    const treatValuePanel = (panelData) => {
      const name        = panelData.name
      const options     = []
      const optionData  = {}
      const panelValues = values[name] = {}
      panel = panel || (panelData.selected ? name : undefined)

      if (panels.indexOf(name) < 0) {
        panels.push(name)
      } else {
        console.log("Duplicate value panel name:", name)
      }

      panelData.options.forEach( option  => {
        // { name
        // , tooltip
        // , min
        // , max
        // , step
        // , value
        // }

        const min = Math.min(option.min, option.max)
        const max = Math.max(option.min, option.max)
        const step = Math.min(option.step, max - min)
        const value = Math.max(min, Math.min(option.value, max))
        // Initial value may not be aligned to step
        panelValues[option.name] = value
        delete option.value

        options.push(option.name)

        option.min = min
        option.max = max
        option.step = step

        optionData[option.name] = option
      })

      delete panelData.selected
      panelData.type       = "value"
      panelData.position   = panelData.position || 0
      panelData.bgColor    = panelData.bgColor  || "#000"
      panelData.options    = options    // names of options
      panelData.optionData = optionData // display details
      // name      \
      // tooltip    🡂 optional
      // icon      /

      panelMap[name] = panelData
    }


    const byPanelPosition = (a, b) => (
      panelMap[a].position - panelMap[b].position
    )

    // EXECUTION STARTS HERE // EXECUTION STARTS HERE //

    settings.selections.forEach( panelData => {
      treatSelectionPanel(panelData)
    })

    settings.values.forEach( panelData => {
      treatValuePanel(panelData)
    })

    panels.sort(byPanelPosition)

    // Ensure a default panel is selected

    if (!panel) {
      panel = panels[0].name
    }

    result.panel = panel

    return result
  }
}



export default new Settings()