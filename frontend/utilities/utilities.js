/**
 * utilities.js
 *
 * Provides a set of re-usable functions which can be imported
 * anywhere
 */


/// COLOUR FUNCTIONS //

export const rgbify = (color) => {
 if (color.length === 3) {
    color = color[0]+color[0]+color[1]+color[1]+color[2]+color[2]
  }

  const hex = parseInt(color, 16)

  return [
    hex >> 16           // red
  ,(hex >>  8) & 0x00FF // green
  , hex        & 0xFF   // blue
  ]
}



export const toneColor = (color, ratio) => {
  const prefix = color[0] === "#"

  if (prefix) {
    color = color.slice(1)
  }

  const rgb = rgbify(color)
             .map( value => {
    value = Math.floor(Math.max(0, Math.min(255, value * ratio)))
    return ((value < 16) ? "0" : "") + value.toString(16)
  })

  return (prefix ? "#" : "") + rgb.join("")
}



export const translucify = (color, opacity) => {
  if (color[0] === "#") {
    color = color.slice(1)
  }

  const rgb = rgbify(color)

  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`
}



/**
 * @param   {<type>}  color   Must be a color (rgb or hex)
 * @param   {object}  values  May be an object with the same
 *                            structure as defaults
 * @return  {object}  Returns an object with the same structure as
 *                    defaults, but where each value is a color
 */
export const buttonColors = (color, values) => {
  const output = {
    restBg:     1
  , restTint:   1.5
  , restShade:  0.75

  , overBg:    1.1
  , overTint:  1.65
  , overShade: 0.667

  , downBg:    0.95
  , downTint:  1.333
  , downShade: 0.6
  }
  const keys = Object.keys(output)

  ;(function merge(input) {
    if (typeof input === "object") {     
      keys.forEach( key => {
        const value = input[key]
        if (!isNaN(value)) {
          if (value > 0) {
            output[key] = value
          }
        }
      })
    }
  })()

  keys.forEach( key => (
    output[key] = toneColor(color, output[key])
  ))

  return output 
}


/// ARRAY FUNCTIONS ///

export const removeFrom = (array, item, removeAll) => {
  let index
  let found, success = 0

  do {
    if (typeof item === "function") {
      index = array.findIndex(item)
    } else {
      index = array.indexOf(item)
    }

    found = !(index < 0)
    if (found) {
      array.splice(index, 1)
      success += 1
    }
  } while (removeAll && found)

  return success
}



export const getDifferences = () => {
  let  previous = []

  return (array) => {
    const plus = array.filter(item => previous.indexOf(item) < 0)
    const minus = previous.filter(item => array.indexOf(item) < 0)
    previous = [...array]

    return { plus, minus }
  }
}



export const trackChanges = (array) => {
  const current = array
  let  previous = [...array]

  return () => {
    const plus = array.filter(item => previous.indexOf(item) < 0)
    const minus = previous.filter(item => array.indexOf(item) < 0)
    previous = [...array]

    return { plus, minus }
  }
}



export const shuffle = (a) => {
  let ii = a.length

  while (ii) {
    const jj = Math.floor(Math.random() * ii)
    ii -= 1;
    [a[ii], a[jj]] = [a[jj], a[ii]]
  }

  return a // for chaining
}



export const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min
}



export const getRandomFromArray = (array) => {
  return array[Math.floor(Math.random() * array.length)]
}



/// MOUSE/TOUCH EVENT FUNCTIONS ///

export const getPageXY = (event) => {
    if (event.targetTouches && event.targetTouches.length) {
      event = event.targetTouches[0] || {}
    }

    return { x: event.pageX, y: event.pageY }
  }



/**
 * Returns a promise which will be:
 * * resolved if the mouse or touch moves more than triggerDelta
 *   pixels in any direction
 * * rejected if the mouse is released/touch gesture ends before
 *   moving that far
 *
 * @param  {event}  event should be a mousedown or touchstart event
 * @param  {number} triggerDelta should be a positive number of pixels
 *
 * @return  {promise}
 */
export const detectMovement = (event, triggerDelta) => {
  const trigger2 = triggerDelta * triggerDelta

  function movementDetected(resolve, reject) {
    const { x: startX, y: startY } = getPageXY(event)
    const options = { event, drag, drop }
    const cancel = setTrackedEvents(options)
    // { actions: { move: <"touchmove" | "mousemove">
    //              end:  <"toucheend" | "mouseup">
    // , drag: function
    // , drop: function
    // }

    // Check if the mouse/touch has moved more than triggerDelta
    // pixels in any direction, and resolve promise if so.
    function drag(event) {
      const { x, y } = getPageXY(event)
      const deltaX = startX - x
      const deltaY = startY - y
      const delta2 = (deltaX * deltaX + deltaY * deltaY)

      if (delta2 > trigger2) {
        setTrackedEvents(cancel)
        resolve()
      }
    }

    // Reject promise if the mouse is release before the mouse/touch
    // moved triggerDelta pixels in any direction.
    function drop(event) {
      setTrackedEvents(cancel)
      reject()
    }
  }

  return new Promise(movementDetected)
}



export const setTrackedEvents = ({ actions, event, drag, drop }) => {
  // Omit event to cancel tracking
  const body = document.body

  if (event) {
    if (typeof actions !== "object") {
      actions = {}
    }

    if (event.type === "touchstart") {
      actions.move  = "touchmove"
      actions.end   = "touchend"
    } else {
      actions.move  = "mousemove"
      actions.end   = "mouseup"
    }

    body.addEventListener(actions.move, drag, false)
    body.addEventListener(actions.end, drop, false)

  } else {
    body.removeEventListener(actions.move, drag, false)
    body.removeEventListener(actions.end, drop, false)
  }

  return { actions, drag, drop }
}


/// RECT & OBJECT FUNCTIONS ///

export const intersect = (rect1, rect2) => {
  return rect1.x < rect2.right
      && rect2.x < rect1.right
      && rect1.y < rect2.bottom
      && rect2.y < rect1.bottom
}



export const union = (rects) => {
  const [ rect, ...rest ] = rects
  let { left, right, top, bottom } = rect

  rest.forEach( rect => {
    left   = Math.min(left,   rect.left)
    right  = Math.max(right,  rect.right)
    top    = Math.min(top,    rect.top)
    bottom = Math.max(bottom, rect.bottom)
  })

  const x = left
  const y = top
  const width = right - left
  const height = bottom - top

  return { x, y, left, right, top, bottom, width, height }
}



export const pointWithin = ( x, y, rect ) => {
  return rect.x <= x
      && rect.y <= y
      && rect.right > x
      && rect.bottom > y
}



export const valuesMatch = (a, b) => {
  if ( !a || typeof a !== "object" || !b || typeof b !== "object") {
    return false
  }

  const propsA = Object.getOwnPropertyNames(a)
  const propsB = Object.getOwnPropertyNames(b)

  if (propsA.length !== propsA.length) {
    return false
  }

  const total = propsA.length
  for ( let ii = 0; ii < total; ii += 1 ) {
    const prop = propsA[ii]

    if (a[prop] !== b[prop]) {
      return false
    }

    if (!removeFrom(propsB, prop)) {
      // prop is undefined in a and missing in b
      return false
    }
  }

  return true
}


// FONTS //

export const getFontFamily = (ff) => {
  const start = ff.indexOf('family=')
  if (start === -1) return 'sans-serif'
  let end = ff.indexOf('&', start)
  if(end === -1) end = undefined
  ff = ff.slice(start + 7, end).replace("+", " ")
  ff = '"'+ ff + '"'
  return ff // + ', sans-serif'
}


// ENCRYPTION

// by bryc https://stackoverflow.com/a/52171480/1927589 
export const hash = function(str, seed = 0) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ h1>>>16, 2246822507)
       ^ Math.imul(h2 ^ h2>>>13, 3266489909);
    h2 = Math.imul(h2 ^ h2>>>16, 2246822507)
       ^ Math.imul(h1 ^ h1>>>13, 3266489909);

    return 4294967296 * (2097151 & h2) + (h1>>>0);
};