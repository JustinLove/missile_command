console.log('boostrap')
// immediately invoked function was causing undefined function error
var missileCommandRequireSetup = function() {
  var paths = require.s.contexts._.config.paths
  paths.missile_command = 'coui://ui/mods/missile_command'
  paths.text = paths.text || 'coui://ui/mods/missile_command/text'
}
missileCommandRequireSetup()

// make the object keys exist for Panel.ready
var missile_command_stub = function() {}
_.defaults(handlers, {
  selection: missile_command_stub
})
require(['missile_command/missile_command'], function(missile_command) {
  "use strict";

  $(missile_command.ready)
})
