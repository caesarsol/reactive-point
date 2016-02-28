import $ from 'jquery-enhanced'

export class ReactivePointLogger {
  constructor(point, name, {color, centerOn}) {
    const width = 5

    this.point = point
    this.name = name
    this.center = centerOn || {x: 0, y: 0}

    this.$marker = $('<div>', {
      id: this.name,
      css: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1 + width * 2,
        height: 1 + width * 2,
        margin: 0,
        padding: 0,
        background: color,
        marginLeft: -width,
        marginTop: -width,
      },
    })
    this.$label = $('<span>', {
      html: this.name,
      css: {
        display: 'inline-block',
        width: 120,
        fontFamily: 'sans-serif',
        fontSize: 13,
      },
      append: $('<div>', {css: {background: color}}),
    })
    this.$coordinateLoggerX = $('<input>', {
      width: 120,
      css: {
        backgroundColor: 'transparent',
        color: 'inherit',
        border: 'none',
      },
    })
    this.$coordinateLoggerY = $('<input>', {
      width: 120,
      css: {
        backgroundColor: 'transparent',
        color: 'inherit',
        border: 'none',
      },
    })
    this.$coordinateLoggerM = $('<input>', {
      width: 120,
      css: {
        backgroundColor: 'transparent',
        color: 'inherit',
        border: 'none',
      },
    })
  }

  watch() {
    this.point.addWatcher(() => this.log())
  }

  mount(dom_element) {
    this.$marker.appendTo(dom_element)

    $('<div>', {className: 'point-logger', css: {color: '#ccc'}}).append([
      this.$label,
      this.$coordinateLoggerX,
      this.$coordinateLoggerY,
      this.$coordinateLoggerM,
    ]).appendTo(dom_element)

    this.watch()
    this.log()

    return this
  }

  log() {
    this.$marker.translatePoint(this.point.added(this.center))
    this.$coordinateLoggerX.val(this.point.x)
    this.$coordinateLoggerY.val(this.point.y)
    this.$coordinateLoggerM.val(this.point.module())
  }
}
