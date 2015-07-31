define([
  'missile_command/panel',
  'missile_command/lobby_id',
  'missile_command/specs',
  'missile_command/attack_tracking',
  'missile_command/preview_window',
], function(panel, lobbyId, specs) {
  "use strict";

  model.player.subscribe(function(player) {
    if (!player) return
    specs.nuke_launcher = specs.base_nuke_launcher + player.spec_tag
  })

  var pendingEvents = []
  var missileEvents = function(events) {
    if (events.length < 1) return

    if (api.panels.missile_command) {
      api.panels.missile_command.message('missile_command_events', events)
    } else {
      pendingEvents = pendingEvents.concat(events)
      panel.show()
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

  return {}
})
