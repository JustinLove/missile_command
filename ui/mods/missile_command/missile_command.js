define([
  'missile_command/registry',
  'missile_command/persist',
  'missile_command/preview',
  'missile_command/specs',
  'missile_command/drag_select',
  'missile_command/attack_queue',
  'missile_command/draggable',
  'coui://ui/main/game/live_game/js/constants.js',
  'coui://ui/main/game/live_game/js/events.js',
], function(registry, persist, preview, specs, dragSelect, attackQueue, draggable) {
  "use strict";

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
      attackQueue.queue = []
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
    rapidAttack: attackQueue.rapidAttack,
    selectAll: selectAll,
    dragSelectStart: dragSelect.start,
    dragSelectActive: dragSelect.active,
  }

  return {
    ready: function() {
      console.log('hello')
      $('.missile_command').on('mousedown', draggable.startDragging)
      api.Panel.message(api.Panel.parentId, 'missile_command_hello');
    },
    viewModel: viewModel
  }
})
