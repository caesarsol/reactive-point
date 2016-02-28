import $ from 'jquery'

export default $

function switchCase(subject) {
  const noop = {when: () => noop, default: () => noop}
  return {
    when(compare, then) {
      if (subject === compare) {
        then()
        return noop
      } else {
        return this
      }
    },
    default: (then) => then(),
  }
}

$.fn.transform = function (transf, ...values) {
  let transforms = this.data('transforms')

  if (!transforms || transforms.length === 0) {
    transforms = new Map()
  }

  switchCase(transf)
    .when('translate', () => {
      let [x, y] = values
      transforms.set('translate', `${x}px, ${y}px`)
    })
    .when('rotate', () => {
      let [degrees] = values
      transforms.set('rotate', `${degrees}deg`)
    })
    .default(() => {
      throw ('Transformation not supported')
    })

  let transfString = Array.from(transforms.entries()).map(([k, v]) => `${k}(${v})`).join(' ')

  this.css('transform', transfString)
  this.data('transforms', transforms)

  return this
}

$.fn.translate = function (x, y) {
  /* Position object absolutely */
  window.requestAnimationFrame(() =>
    this.transform('translate', x, y)
  )
  return this
}

$.fn.rotate = function (degrees, {center} = {}) {
  if (center) {
    let originCss = `${center.x}px ${center.y}px`
    if (!this.css('transform-origin') !== originCss) {
      this.css('transform-origin', originCss)
    }
  }
  window.requestAnimationFrame(() =>
    this.transform('rotate', degrees)
  )
  return this
}

$.fn.translatePoint = function (point) {
  return this.translate(point.x, point.y)
}
