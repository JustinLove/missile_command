var model;
var handlers = {};

;(function() {
  var config = require.s.contexts._.config
  config.waitSeconds = 0
  config.paths.missile_command = 'coui://ui/mods/missile_command'
  config.paths.text = config.paths.text || 'coui://ui/mods/missile_command/text'
})()

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
