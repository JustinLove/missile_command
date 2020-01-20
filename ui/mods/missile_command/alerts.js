define([
  'missile_command/panel',
], function(panel) {
  "use strict";

  var pendingEvents = []
  var missileEvents = function(events) {
    if (events.length < 1) return

    if (api.panels.missile_command) {
      api.panels.missile_command.message('missile_command_events', events)
    } else {
      events.forEach(function(event) {
        pendingEvents.push(event)
      })
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

    if (live_game_watch_list) {
      live_game_watch_list(payload)
    }

    missileEvents(payload.list.filter(myMissileEvent))
  }

  return {
    pendingEvents: pendingEvents
  }
})
