define([], function() {
  "use strict";

  var launchersInBox = function(x1, y1, x2, y2) {
    var left, right, top, bottom
    if (x1 <= x2) {
      left = x1
      right = x2
    } else {
      left = x2
      right = x1
    }
    if (y1 <= y2) {
      top = y1
      bottom = y2
    } else {
      top = y2
      bottom = y1
    }
    $('#select_box').css({
      top: top,
      left: left,
      width: right - left,
      height: bottom - top,
    })
    return $('.missile').filter(function() {
      var $el = $(this)
      var offset = $el.offset()
      var w = $el.width()
      var h = $el.height()
      return !(right < offset.left || left > offset.left + w || bottom < offset.top || top > offset.top + h)
    }).map(function() {return parseInt($(this).attr('missileid'), 10)}).get()
  }

  var dragSelectTimer
  var dragSelectX
  var dragSelectY
  var dragSelectActive = ko.observable(false)

  var dragSelectStart = function(launcher, ev) {
    if (ev.button != 0) return

    dragSelectX = ev.clientX
    dragSelectY = ev.clientY

    $(document).on('mouseup', dragSelectStop)

    dragSelectTimer = setTimeout(function() {
      dragSelectActive(true)
      $(document).on('mousemove', dragSelectMove)
    }, 300)

    ev.stopPropagation()
  }

  var dragSelectStop = function(ev) {
    var selected = launchersInBox(dragSelectX, dragSelectY, ev.clientX, ev.clientY)
    engine.call("select.byIds", selected)
    clearTimeout(dragSelectTimer)
    dragSelectTimer = null
    dragSelectActive(false)
    $(document).off('mouseup', dragSelectStop)
    $(document).off('mousemove', dragSelectMove)
  }

  var dragSelectMove = function(ev) {
    var selected = launchersInBox(dragSelectX, dragSelectY, ev.clientX, ev.clientY)
    engine.call("select.byIds", selected)
  }

  return {
    start: dragSelectStart,
    active: dragSelectActive,
  }
})
