define([], function() {
  "use strict";

  var dragTimer

  var startDragging = function() {
    $(document).on('mouseup', stopDragging)

    dragTimer = setTimeout(function() {
      api.Panel.message(api.Panel.parentId, 'missile_command_drag');
      $('body').addClass('dragmode')
    }, 300)
  }

  var stopDragging = function(ev) {
    clearTimeout(dragTimer)
    dragTimer = null
    $(document).off('mouseup', stopDragging)
    $('body').removeClass('dragmode')
  }

  return {
    startDragging: startDragging,
    stopDragging: stopDragging,
  }
})
