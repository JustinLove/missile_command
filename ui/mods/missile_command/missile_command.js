define([
  'text!missile_command/missile_command.html'
], function(html) {
  "use strict";

  var nuke_launcher = '/pa/units/land/nuke_launcher/nuke_launcher.json'

  var originalSelection = handlers.selection
  handlers.selection = function(payload) {
    var si = payload.spec_ids
    if (Object.keys(si).length == 1) {
      if (si[nuke_launcher] && si[nuke_launcher].length == 1) {
        console.log(si[nuke_launcher])
      }
    }
    originalSelection(payload)
  }

  return {
    ready: function() {
      var container = $(html)
      container.appendTo('body')
      ko.applyBindings(model, container[0])
    }
  }
})
