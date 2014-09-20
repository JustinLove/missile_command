define([
  'missile_command/panel',
  'missile_command/registry',
  'missile_command/persist',
  'missile_command/preview',
  'missile_command/sanity_check',
], function(panel, registry, persist, preview, sanityCheck) {
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

  var checkCommand = function(command, selected) {
    if (command == 'attack' && selected) {
      registry.unready(selected)
      nextAttacker()
    }
  }

  model.selection.subscribe(function(payload) {
    sanityCheck.check(payload)
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
  })

  var originalUnitCommand = api.Holodeck.prototype.unitCommand
  api.Holodeck.prototype.unitCommand = function(command, x, y, queue) {
    var selected = model.selection().spec_ids[nuke_launcher]
    return originalUnitCommand.apply(this, arguments).success(
      function() {checkCommand(command, selected)})
  }

  var originalTargetCommand = api.unit.targetCommand
  api.unit.targetCommand = function(command, target, queue) {
    var selected = model.selection().spec_ids[nuke_launcher]
    return originalTargetCommand.apply(this, arguments).success(
      function() {checkCommand(command, selected)})
  }

  var viewModel = {
    visible: ko.computed(function() {
      return registry.registry().length > 0 && model.mode() != 'game_over'
    }),
  }

  return {
    ready: function() {
      panel()

      // some api methods doesn't exist at load time
      setTimeout(initiateStorage, 0)
      setTimeout(installDisconnectHook, 0)
    },
    viewModel: viewModel
  }
})