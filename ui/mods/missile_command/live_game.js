define([
  'missile_command/panel',
  'missile_command/lobby_id',
  'missile_command/specs',
  'missile_command/attack_tracking',
], function(panel, lobbyId, specs) {
  "use strict";

  model.player.subscribe(function(player) {
    if (!player) return
    specs.nuke_launcher = specs.base_nuke_launcher + player.spec_tag
  })

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
      if (si[specs.nuke_launcher] && si[specs.nuke_launcher].length == 1) {
        return true
      }
    }
    return false
  }

  var viewModel = panel.viewModel

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

    api.panels.options_bar && api.panels.options_bar.message('missile_command_loading', false)
  }

  handlers.missile_command_polite_show_unit = function(id) {
    var playerHasState = model.mode().match('command_') || !matchingSelection()
    if (!playerHasState) {
      model.showUnitPreview(id)
    }
  }

  return {
    insert: panel.insert,
    viewModel: panel.viewModel
  }
})
