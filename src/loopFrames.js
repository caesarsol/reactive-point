export function loopFrames(func) {
  let loopControl = {
    _continueFlag: true,
    break: function () { this._continueFlag = false },
  }

  window.requestAnimationFrame(() => {
    func(loopControl)
    if (loopControl._continueFlag) loopFrames(func)
  })
}
