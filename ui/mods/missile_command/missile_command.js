define([
  'missile_command/registry',
  'missile_command/persist',
  'missile_command/preview',
  'coui://ui/main/game/live_game/js/constants.js',
  'coui://ui/main/game/live_game/js/events.js',
], function(registry, persist, preview) {
  "use strict";

  var nuke_launcher = '/pa/units/land/nuke_launcher/nuke_launcher.json'

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

  handlers.selection = function(payload) {
    if (!payload) {
      registry.showSelected([])
      // can't use this to reset attackQueue because we ALWAYS get a null event when changing selection
      return
    }

    var perfect = false
    var si = payload.spec_ids
    if (Object.keys(si).length == 1) {
      if (si[nuke_launcher]) {
        if (si[nuke_launcher].length == 1) {
          registry.register(si[nuke_launcher][0])
          perfect = true
        } else {
          registry.notice(si[nuke_launcher])
        }
      }
    }

    if (!perfect) {
      attackQueue = []
    }

    registry.showSelected(si[nuke_launcher])
  }

  handlers.watch_list = function(payload) {
    //console.log(payload);
    payload.list.forEach(function(alert) {
      if (eventSystem.isType(constants.unit_type.Nuke, alert.unit_types)) {
        if (alert.watch_type == constants.watch_type.ready) {
          registry.created(alert.id, {location: alert.location, planet_id: alert.planet_id})
        } else if (alert.watch_type == constants.watch_type.death) {
          registry.destroyed(alert.id)
        }
      }
    })
  }

  handlers.missile_command_state = function(payload) {
    //console.log(payload)
    if (payload.lobbyId) {
      persist.enableStorage(payload.lobbyId, registry.registry)
    }
  }

  handlers.missile_command_attacked = function(selected) {
    registry.unready(selected)
    nextAttacker()
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
    rapidAttack: rapidAttack
  }

  return {
    ready: function() {
      console.log('hello')
      api.Panel.message(api.Panel.parentId, 'missile_command_hello');
    },
    viewModel: viewModel
  }
})
