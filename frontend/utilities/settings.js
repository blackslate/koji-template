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
               || (this.settings.values[key] = [])
    
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

    const treatSelectionPanel = (selectionData) => {
      const name       = selectionData.name
      const selected   = []
      const mode       = selectionData.mode || "zeroOrMore"
      const options    = []
      const optionData = {}
      panel = panel || (selectionData.selected ? name : undefined)

      if (panels.indexOf(name) < 0) {
        panels.push(name)
      } else {
        console.log("Duplicate selection panel name:", name)
      }
      
      selectionData.options.forEach( option  => {
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

      delete selectionData.selected
      selectionData.type       = "selection"
      selectionData.mode       = mode
      selectionData.position   = selectionData.position || 0
      selectionData.bgColor    = selectionData.bgColor   || "#000"
      selectionData.hasMaster  = !!selectionData.hasMaster
      selectionData.options    = options
      selectionData.optionData = optionData
      // name      \
      // tooltip    🡂 optional
      // icon      /

      panelMap[name] = selectionData
    }


    const treatValuePanel = (valueData) => {
      const name = valueData.name
      const values = {}
      const optionData = {}
      panel = panel || (valueData.selected ? name : undefined)

      if (panels.indexOf(name) < 0) {
        panels.push(name)
      } else {
        console.log("Duplicate value panel name:", name)
      }
      
      valueData.options.forEach( option  => {
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
        const value = Math.max(min, Math.min(value, max))
        // Initial value may not be aligned to step
        values[option.arrayname] = value
        delete option.value

        option.min = min
        option.max = max
        option.step = step

        optionData[option.name] = option
      })

      delete valueData.selected
      valueData.type       = "value"
      valueData.position   = valueData.position || 0
      valueData.bgColor    = valueData.bgColor  || "#000"
      valueData.optionData = optionData
      // name      \
      // tooltip    🡂 optional
      // icon      /
      
      panelMap[name] = valueData
    }


    const byPanelPosition = (a, b) => (
      panelMap[a].position - panelMap[b].position
    )

    // EXECUTION STARTS HERE // EXECUTION STARTS HERE //

    settings.selections.forEach( selectionData => {
      treatSelectionPanel(selectionData)
    })

    settings.values.forEach( valueData => {
      treatValuePanel(valueData)
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