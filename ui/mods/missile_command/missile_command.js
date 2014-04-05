define([
  'missile_command/registry',
  'missile_command/preview',
  'text!missile_command/missile_command.html'
], function(registry, preview, html) {
  "use strict";

  var nuke_launcher = '/pa/units/land/nuke_launcher/nuke_launcher.json'

  var originalSelection = handlers.selection
  handlers.selection = function(payload) {
    var si = payload.spec_ids
    if (Object.keys(si).length == 1) {
      if (si[nuke_launcher] && si[nuke_launcher].length == 1) {
        registry.register(si[nuke_launcher][0])
      }
    }
    originalSelection(payload)
  }

  var viewModel = {
    registry: registry.registry,
    open: ko.observable(true),
    toggle: function() { this.open(!this.open()) },
    hidePreview: preview.hide
  }

  return {
    ready: function() {
      createFloatingFrame('missile_command_frame', 210, 40, {'offset': 'leftCenter', 'left': 0});
      var $container = $('#missile_command_frame_content')
      $(html).appendTo($container)
      ko.applyBindings(viewModel, $container[0])
    }
  }
})
