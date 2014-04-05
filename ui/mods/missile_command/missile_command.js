define([
  'missile_command/registry',
  'text!missile_command/missile_command.html'
], function(registry, html) {
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
    registry: registry.registry
  }

  return {
    ready: function() {
      var container = $(html)
      container.appendTo('body')
      ko.applyBindings(viewModel, container[0])
    }
  }
})
