import $ from 'jquery-enhanced'
import {ReactivePoint} from 'ReactivePoint'
import {ReactivePointLogger} from 'ReactivePointLogger'

let position = new ReactivePoint()
let desired = new ReactivePoint()
let mouse = new ReactivePoint()

new ReactivePointLogger(desired, 'desired', {color: 'blue'}).mount(document.body)
new ReactivePointLogger(position, 'position', {color: 'yellow'}).mount(document.body)

mouse.addUpdater((pt) => {
  $(document).on('mousemove touchstart touchmove', (event) => {
    pt.setWith(
      x => event.pageX,
      y => event.pageY,
    )
  })
})

desired.follow(mouse)
position.followAnimating(desired, {dampening: 0.05, maxVelocity: 15, maxAcceleration: 0.5})

let $image = $('.bb8')
let $wheel = $image.find('.ball')

position.addWatcher((pt) => {
  $image.translate(pt.x, 0)
  $wheel.rotate(pt.x)

  if (position.x < desired.x) {
    $('.antennas, .eyes').addClass('right')
  } else {
    $('.antennas, .eyes').removeClass('right')
  }
})
