define([
  'missile_command/registry',
  'missile_command/specs',
], function(registry, specs) {
  "use strict";

  var armyIndex = 0
  var numberOfPlanets = 1
  var currentPlanet = 0

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

  var pollArmy = function() {
    api.getWorldView(0).getArmyUnits(armyIndex, currentPlanet).then(function(army) {
      var launchers = army[specs.nuke_launcher]
      if (launchers) {
        registry.notice(launchers)
      }
    })
    currentPlanet = (currentPlanet + 1) % numberOfPlanets
  }

  var poll = function() {
    pollArmy()
    pollLaunchers()
    setTimeout(poll, 5000)
  }

  return {
    start: function(ai, np) {
      armyIndex = ai
      numberOfPlanets = np
      poll()
    },
  }
})
