define([
  'missile_command/specs',
], function(specs) {
  "use strict";

  var checkCommand = function(command, selected) {
    if (command == 'attack' && selected) {
      api.panels.missile_command.message('missile_command_attacked', selected)
    }
  }

  var wantsToAttack = false

  model.selection.subscribe(function(payload) {
    if (!payload) {
      return
    }

    if (wantsToAttack && model.allowedCommands.Attack) {
      model.setCommandIndex(1)
      wantsToAttack = false
    }
  })

  // action left click
  var originalUnitCommand = api.Holodeck.prototype.unitCommand
  api.Holodeck.prototype.unitCommand = function(command, x, y, queue) {
    var selected = model.selection() && model.selection().spec_ids[specs.nuke_launcher]
    return originalUnitCommand.apply(this, arguments).success(
      function() {checkCommand(command, selected)})
  }

  // drag command
  var originalUnitEndCommand = api.Holodeck.prototype.unitEndCommand
  api.Holodeck.prototype.unitEndCommand = function(command, x, y, queue) {
    var selected = model.selection() && model.selection().spec_ids[specs.nuke_launcher]
    return originalUnitEndCommand.apply(this, arguments).success(
      function() {checkCommand(command, selected)})
  }

  // right click
  var originalTargetCommand = api.unit.targetCommand
  api.unit.targetCommand = function(command, target, queue) {
    var selected = model.selection() && model.selection().spec_ids[specs.nuke_launcher]
    return originalTargetCommand.apply(this, arguments).success(
      function() {checkCommand(command, selected)})
  }

  handlers.missile_command_attack = function() {
    if (model.allowedCommands.Attack) {
      model.setCommandIndex(1)
    } else {
      wantsToAttack = true
    }
  }
})
