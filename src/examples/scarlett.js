import $ from 'jquery-enhanced'
import {ReactivePoint} from 'ReactivePoint'
import {ReactivePointLogger} from 'ReactivePointLogger'

$(window).load(() => {
  let $box = $('.box')
  let boxDim = {
    x: $box.width(),
    y: $box.height(),
  }
  let boxPos = {
    x: $box.offset().left,
    y: $box.offset().top,
  }

  let $image = $('.parallaz')
  let imageDim = {
    x: $image.width(),
    y: $image.height(),
  }

  let depth = new ReactivePoint().setWith((c, cn) =>
        boxDim[cn] / (boxDim[cn] - imageDim[cn])
  )

  let boxCenter = new ReactivePoint(boxDim.x / 2, boxDim.y / 2)
  let imageCenter = new ReactivePoint(imageDim.x / 2, imageDim.y / 2)

  let position = new ReactivePoint()
  let desiredFocus = new ReactivePoint()
  let currentFocus = new ReactivePoint()
  let mouse = new ReactivePoint()

  mouse.addUpdater((pt) => {
    $box.on('mousemove', (event) => {
      pt.setWith(
        x => event.pageX + boxPos.x,
        y => event.pageY + boxPos.y,
      )
    })
  })

  desiredFocus.follow(mouse)

  currentFocus.followAnimating(desiredFocus, {dampening: 0.05, maxVelocity: 30, maxAcceleration: 5})

  position.addUpdater((position) => {
    currentFocus.addWatcher((currentFocus) => {
      position.setWith((c, cn) => currentFocus[cn] / depth[cn])
    })
  })

  position.addWatcher((pt) => {
    $image.translate(pt.x, pt.y)
    // $image.rotate((pt.x / 500 * 90) + 180, {center: imageCenter})
  })

  currentFocus.setOn(boxCenter)
  mouse.setOn(boxCenter)

  new ReactivePointLogger(boxCenter, 'boxCenter', {color: 'green'}).mount($box)
  new ReactivePointLogger(desiredFocus, 'desiredFocus', {color: 'blue'}).mount($box)
  new ReactivePointLogger(currentFocus, 'currentFocus', {color: 'red'}).mount($box)
  new ReactivePointLogger(position, 'position', {color: 'yellow', centerOn: imageCenter}).mount($box)
})
