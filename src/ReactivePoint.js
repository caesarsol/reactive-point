import {loopFrames} from 'loopFrames'

export class ReactivePoint {
  constructor(x = 0, y = 0) {
    this._x = x
    this._y = y

    // list of callbacks we call after each change
    this._watchers = []

    this._callWatchers()
  }

  addWatcher(callback) {
    this._watchers.push(callback.bind(this))
  }

  _callWatchers() {
    this._watchers.forEach((callback) => callback(this))
  }

  addUpdater(updaterFunc) {
    updaterFunc(this)
  }

  get x() { return this._x }
  get y() { return this._y }

  get position() {
    return [this.x, this.y]
  }

  set(x, y) {
    this._x = x
    this._y = y
    this._callWatchers()
    return this
  }

  setWith(transformX, transformY = null) {
    /*
     * Accepts one or two callbacks of the form:
     *   function(coordinateValue, coordinateName)
     *
     */
    if (!transformY) transformY = transformX

    this.set(transformX(this.x, 'x'), transformY(this.y, 'y'))
    return this
  }

  /* Other Points */

  setOn(otherPoint) {
    this.set(otherPoint.x, otherPoint.y)
    return this
  }

  follow(otherPoint, transform = (pt) => pt) {
    otherPoint.addWatcher(() => {
      this.setOn(transform(otherPoint))
    })
    return this
  }

  followAnimating(otherPoint, {dampening, maxVelocity, maxAcceleration}) {
    let velocity = 0
    let remains = new ReactivePoint()
    otherPoint.addWatcher(() => {
      if (velocity > 0) return
      loopFrames((loop) => {
        remains.setOn(otherPoint.subtracted(this))
        if (remains.module() > dampening) {
          let oldVelocity = velocity
          let advance = remains.multiplied(dampening)
          velocity = advance.module()

          if (velocity > maxVelocity) {
            // Velocity: pixel/frame
            advance.setModule(maxVelocity)
            velocity = maxVelocity
          }

          if (velocity - oldVelocity > maxAcceleration) {
            velocity = oldVelocity + maxAcceleration
            advance.setModule(velocity)
          }

          this.add(advance)
        } else {
          this.setOn(otherPoint)
          velocity = 0
          loop.break()
        }
      })
    })
    return this
  }

  /* Math */

  add(otherPoint) {
    this.setWith((c, cn) => c + otherPoint[cn])
    return this
  }

  subtract(otherPoint) {
    this.setWith((c, cn) => c - otherPoint[cn])
    return this
  }

  multiply(scalar) {
    this.setWith(c => c * scalar)
    return this
  }

  normalize() {
    let m = this.module()
    this.setWith(c => c / m)
    return this
  }

  setModule(module) {
    this.normalize().multiply(module)
    return this
  }

  /* Immutable Math */

  duplicated() {
    return new ReactivePoint().setOn(this)
  }

  added(otherPoint) {
    return this.duplicated().add(otherPoint)
  }

  subtracted(otherPoint) {
    return this.duplicated().subtract(otherPoint)
  }

  multiplied(scalar) {
    return this.duplicated().multiply(scalar)
  }

  normalized() {
    return this.duplicated().normalize()
  }

  /* Scalars */

  moduleSquared() {
    return Math.pow(this.x, 2) + Math.pow(this.y, 2)
  }

  module() {
    return Math.sqrt(this.moduleSquared())
  }
}
