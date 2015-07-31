define([
  'missile_command/registry',
], function(registry) {
  "use strict";

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

  handlers.missile_command_attacked = function(selected) {
    registry.unready(selected)
    nextAttacker()
  }

  return {
    queue: attackQueue,
    rapidAttack: function() {
      attackQueue = registry.attackQueue()
      nextAttacker()
    },
  }
})
