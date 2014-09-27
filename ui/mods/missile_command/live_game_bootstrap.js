console.log('bootstrap')
// immediately invoked function was causing undefined function error
var missileCommandRequireSetup = function() {
  var config = require.s.contexts._.config
  config.waitSeconds = 0
  config.paths.missile_command = 'coui://ui/mods/missile_command'
  config.paths.text = config.paths.text || 'coui://ui/mods/missile_command/text'
}
missileCommandRequireSetup()

// make the object keys exist for Panel.ready
var missile_command_stub = function() {}
_.defaults(handlers, {
  missile_command_attack: missile_command_stub,
  missile_command_hello: missile_command_stub,
  missile_command_polite_show_unit: missile_command_stub,
  selection: missile_command_stub
})
require(['missile_command/live_game'], function(live_game) {
  "use strict";

  $(live_game.ready)
})
