define([
  'missile_command/registry',
  'missile_command/persist',
  'missile_command/preview',
  'missile_command/specs',
  'coui://ui/main/game/live_game/js/constants.js',
  'coui://ui/main/game/live_game/js/events.js',
], function(registry, persist, preview, specs) {
  "use strict";

  var attackQueue = []
  var nextAttacker = function() {
    if (attackQueue.length > 0) {
      var attacker = attackQueue.shift()
      if (attacker.ready()) {
        api.audio.playSound('/SE/UI/UI_Command_Build')
      } else {
        api.audio.playSound('/SE/UI/UI_Alert_metal_low')
      }
      attacker.attack()
    } else {
      api.audio.playSound('/SE/UI/UI_Command_stop')
    }
  }

  var rapidAttack = function() {
    attackQueue = registry.attackQueue()
    nextAttacker()
  }

  var selectAll = function() {
    api.getWorldView(0).selectByTypes('add', [specs.nuke_launcher])
  }

  handlers.selection = function(payload) {
    if (!payload) {
      registry.showSelected([])
      // can't use this to reset attackQueue because we ALWAYS get a null event when changing selection
      return
    }

    //console.log(payload)

    var perfect = false
    var si = payload.spec_ids
    if (Object.keys(si).length == 1) {
      if (si[specs.nuke_launcher]) {
        if (si[specs.nuke_launcher].length == 1) {
          registry.register(si[specs.nuke_launcher][0])
          perfect = true
        } else {
          registry.notice(si[specs.nuke_launcher])
        }
      }
    }

    if (!perfect) {
      attackQueue = []
    }

    registry.showSelected(si[specs.nuke_launcher])
  }

  handlers.missile_command_events = function(payload) {
    //console.log(payload);
    payload.forEach(function(alert) {
      if (alert.watch_type == constants.watch_type.ready) {
        registry.created(alert.id, {location: alert.location, planet_id: alert.planet_id})
      } else if (alert.watch_type == constants.watch_type.death) {
        registry.destroyed(alert.id)
      }
    })
  }

  handlers.missile_command_state = function(payload) {
    //console.log(payload)
    if (payload.lobbyId) {
      persist.enableStorage(payload.lobbyId, registry.registry)
    }

    if (payload.spec_tag) {
      specs.nuke_launcher = specs.base_nuke_launcher + player.spec_tag
    }

    if (payload.pendingEvents) {
      handlers.missile_command_events(payload.pendingEvents)
    }
  }

  handlers.missile_command_attacked = function(selected) {
    registry.unready(selected)
    nextAttacker()
  }

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

  var viewModel = {
    registry: registry.registry,
    remove: function(id) {
      preview.hide()
      registry.destroyed(id)
    },
    leave: function() {
      preview.hide()
      // prevent all our keys from going to a checkbox or button
      document.activeElement.blur()
    },
    rapidAttack: rapidAttack,
    selectAll: selectAll,
    dragSelectStart: dragSelectStart,
    dragSelectActive: dragSelectActive,
  }

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
    ready: function() {
      console.log('hello')
      $('.missile_command').on('mousedown', startDragging)
      api.Panel.message(api.Panel.parentId, 'missile_command_hello');
    },
    viewModel: viewModel
  }
})
