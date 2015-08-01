define([
  'missile_command/specs',
], function(specs) {
  "use strict";

  var registry = {}
  var armyIndex = 0
  var numberOfPlanets = 1
  var currentPlanet = 0

  var pollArmy = function() {
    api.getWorldView(0).getArmyUnits(armyIndex, currentPlanet).then(function(army) {
      var launchers = army[specs.nuke_launcher]
      if (launchers) {
        registry.notice(launchers)
      }
    })
    currentPlanet = (currentPlanet + 1) % numberOfPlanets
  }

  var pollLaunchers = function() {
    var ids = registry.ids()
    api.getWorldView(0).getUnitState(ids).then(function(states) {
      states.forEach(function(state, i) {
        registry.update(ids[i], !state.build_target, {
          planet_id: state.planet,
          location: state.pos,
        })
      })
    })
  }

  var ping = function(launcher) {
    api.getWorldView(0).getUnitState([launcher.id]).then(function(states) {
      var state = states[0]
      launcher.ready(!state.build_target)
      launcher.target({
        planet_id: state.planet,
        location: state.pos,
      })
    })
  }

  var poll = function() {
    pollArmy()
    pollLaunchers()
    setTimeout(poll, 5000)
  }

  return {
    start: function(reg, ai, np) {
      registry = reg
      armyIndex = ai
      numberOfPlanets = np
      poll()
    },
    ping: ping,
  }
})
