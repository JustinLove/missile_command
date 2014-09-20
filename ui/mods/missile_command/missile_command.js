define([
  'missile_command/registry',
  'missile_command/persist',
  'missile_command/preview',
  'missile_command/sanity_check',
  'coui://ui/main/game/live_game/js/constants.js',
  'coui://ui/main/game/live_game/js/events.js',
], function(registry, persist, preview, sanityCheck) {
  "use strict";

  var initiateStorage = function() {
    var lobbyId = ko.observable().extend({ session: 'lobbyId' });
    console.log('loaded lobbyId', lobbyId())

    if (lobbyId()) {
      persist.enableStorage(lobbyId(), registry.registry)
    } else {
      engine.asyncCall("ubernet.getGameWithPlayer").done(function (data) {
        data = JSON.parse(data);
        console.log(data)
        lobbyId(data.LobbyID)
        persist.enableStorage(data.LobbyID, registry.registry)
      })
    }
  }

  var originalDisconnect
  var clearOnDisconnect = function() {
    var lobbyId = ko.observable().extend({ session: 'lobbyId' });
    if (lobbyId()) {
      var storage = ko.observable().extend({ session: 'missile_command_registered_'+lobbyId() })
      if (storage()) {
        var ser = JSON.parse(storage())
        ser.forEach(function(data) {
          data.grouped = false
        })
        storage(JSON.stringify(ser))
      }
    }

    return originalDisconnect()
  }

  var installDisconnectHook = function() {
    if (model.disconnect) {
      console.log("MC: installing disconnect hook")
      originalDisconnect = model.disconnect
      model.disconnect = clearOnDisconnect
    } else {
      setTimeout(installDisconnectHook, 1000)
    }
  }

  var nuke_launcher = '/pa/units/land/nuke_launcher/nuke_launcher.json'
  //var nuke_launcher = '/pa/units/land/energy_plant/energy_plant.json'

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

  var viewModel = {
    visible: ko.computed(function() {
      return true
      //return registry.registry().length > 0 && model.mode() != 'game_over'
    }),
    registry: registry.registry,
    remove: registry.destroyed,
    open: ko.observable(true),
    toggle: function() { this.open(!this.open()) },
    leave: function() {
      preview.hide()
      // prevent all our keys from going to a checkbox or button
      document.activeElement.blur()
    },
    rapidAttack: rapidAttack
  }

  return {
    ready: function() {
      // some api methods doesn't exist at load time
      setTimeout(initiateStorage, 0)
      setTimeout(installDisconnectHook, 0)
    },
    viewModel: viewModel
  }
})
