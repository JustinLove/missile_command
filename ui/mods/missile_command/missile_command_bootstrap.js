console.log('bootstrap')

var model;
var handlers = {};

// immediately invoked function was causing undefined function error
var missileCommandRequireSetup = function() {
  var paths = require.s.contexts._.config.paths
  paths.missile_command = 'coui://ui/mods/missile_command'
  paths.text = paths.text || 'coui://ui/mods/missile_command/text'
}
missileCommandRequireSetup()

require(['missile_command/missile_command'], function(missile_command) {
  "use strict";

  model = missile_command.viewModel

  // inject per scene mods
  if (scene_mod_list['missile_command'])
      loadMods(scene_mod_list['missile_command']);

  // setup send/recv messages and signals
  app.registerWithCoherent(model, handlers);

  // Activates knockout.js
  ko.applyBindings(model);

  $(missile_command.ready)
})