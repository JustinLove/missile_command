define([
  'missile_command/panel',
  'missile_command/lobby_id',
  'missile_command/specs',
  'missile_command/alerts',
  'missile_command/attack_tracking',
  'missile_command/preview_window',
], function(panel, lobbyId, specs, alerts) {
  "use strict";

  model.player.subscribe(function(player) {
    if (!player) return
    specs.nuke_launcher = specs.base_nuke_launcher + player.spec_tag
  })

  handlers.missile_command_hello = function() {
    console.log('hello', api.panels.missile_command)
    api.panels.missile_command.message('missile_command_state', {
      lobbyId: lobbyId(),
      spec_tag: model.player().spec_tag,
      pendingEvents: alerts.pendingEvents
    });
    alerts.pendingEvents = []

    api.panels.options_bar && api.panels.options_bar.message('missile_command_loading', false)
  }

  return {}
})
