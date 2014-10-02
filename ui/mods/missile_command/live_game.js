define([
  'missile_command/panel',
  'missile_command/lobby_id',
], function(panel, lobbyId) {
  "use strict";

  var base_nuke_launcher = '/pa/units/land/nuke_launcher/nuke_launcher.json'
  var nuke_launcher = base_nuke_launcher

  model.player.subscribe(function(player) {
    if (!player) return
    nuke_launcher = base_nuke_launcher + player.spec_tag
  })

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
    var selected = model.selection().spec_ids[nuke_launcher]
    return originalUnitCommand.apply(this, arguments).success(
      function() {checkCommand(command, selected)})
  }

  // drag command
  var originalUnitEndCommand = api.Holodeck.prototype.unitEndCommand
  api.Holodeck.prototype.unitEndCommand = function(command, x, y, queue) {
    var selected = model.selection().spec_ids[nuke_launcher]
    return originalUnitEndCommand.apply(this, arguments).success(
      function() {checkCommand(command, selected)})
  }

  // right click
  var originalTargetCommand = api.unit.targetCommand
  api.unit.targetCommand = function(command, target, queue) {
    var selected = model.selection().spec_ids[nuke_launcher]
    return originalTargetCommand.apply(this, arguments).success(
      function() {checkCommand(command, selected)})
  }

  model.showUnitPreview = function(id) {
      var previewHolodeck;
      previewHolodeck = model.preview;
      previewHolodeck.$div.show();
      previewHolodeck.update();
      _.delay(api.Panel.update);

      var focused = api.Holodeck.focused;
      previewHolodeck.focus();
      engine.call("select.byIds", [id])
      api.camera.track(true)
      api.camera.setZoom('surface')
      if (focused)
          focused.focus();
  };

  var matchingSelection = function() {
    var payload = model.selection()
    if (!payload) {
      return true
    }

    var si = payload.spec_ids
    if (Object.keys(si).length == 1) {
      if (si[nuke_launcher] && si[nuke_launcher].length == 1) {
        return true
      }
    }
    return false
  }

  var viewModel = {
    visible: ko.observable(false),
  }

  model.gameOverState.subscribe(function(state) {
    if (!state) return
    if (state.defeated || state.game_over) {
      viewModel.visible(false)
    }
  })

  var inserted = false
  var insert = function() {
    panel(viewModel)
    inserted = true
  }
  viewModel.visible.subscribe(function(visible) {
    if (visible && !inserted) {
      insert()
    }

    if (!visible) {
      model.hideAlertPreview();
    }
  })

  viewModel.visible.subscribe(function() {
    api.panels.options_bar && api.panels.options_bar.message('missile_command_visible', viewModel.visible());
  })

  model.toggleMissileCommand = function() {
    viewModel.visible(!viewModel.visible())
  }

  var pendingEvents = []
  var missileEvents = function(events) {
    if (events.length < 1) return

    if (api.panels.missile_command) {
      api.panels.missile_command.message('missile_command_events', events)
    } else {
      pendingEvents = pendingEvents.concat(events)
      viewModel.visible(true)
    }
  }

  var myMissileEvent = function(alert) {
    return (
      (alert.watch_type == constants.watch_type.ready ||
       alert.watch_type == constants.watch_type.death) && 
      eventSystem.isType(constants.unit_type.Nuke, alert.unit_types)
    )
  }

  var live_game_watch_list = handlers.watch_list
  handlers.watch_list = function(payload) {
    //console.log(payload);
    missileEvents(payload.list.filter(myMissileEvent))

    if (live_game_watch_list) {
      live_game_watch_list(payload)
    }
  }

  handlers.missile_command_hello = function() {
    console.log('hello', api.panels.missile_command)
    api.panels.missile_command.message('missile_command_state', {
      lobbyId: lobbyId(),
      spec_tag: model.player().spec_tag,
      pendingEvents: pendingEvents
    });
    pendingEvents = []
  }

  handlers.missile_command_attack = function() {
    if (model.allowedCommands.Attack) {
      model.setCommandIndex(1)
    } else {
      wantsToAttack = true
    }
  }

  handlers.missile_command_polite_show_unit = function(id) {
    var playerHasState = model.mode().match('command_') || !matchingSelection()
    if (!playerHasState) {
      model.showUnitPreview(id)
    }
  }

  return {
    insert: insert,
    viewModel: viewModel
  }
})
