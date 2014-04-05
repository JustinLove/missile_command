define([
  'text!missile_command/missile_command.html'
], function(html) {
  "use strict";

  var nuke_launcher = '/pa/units/land/nuke_launcher/nuke_launcher.json'

  var registry = ko.observableArray()

  var missileViewModel = {
    clone: function(id) {
      var missile = Object.create(this)
      missile.id = id
      return missile
    },
    select: function() {
      console.log(this.id)
      api.select.recallGroup(this.id)
      api.camera.track(true)
    }
  }

  var originalSelection = handlers.selection
  handlers.selection = function(payload) {
    var si = payload.spec_ids
    if (Object.keys(si).length == 1) {
      if (si[nuke_launcher] && si[nuke_launcher].length == 1) {
        var id = si[nuke_launcher][0]
        if (!_.find(registry(), function(m) {return m.id == id})) {
          console.log('unknown', id)
          api.select.captureGroup(id)
          registry.push(missileViewModel.clone(id))
        }
      }
    }
    originalSelection(payload)
  }

  var viewModel = {
    registry: registry
  }

  return {
    ready: function() {
      var container = $(html)
      container.appendTo('body')
      ko.applyBindings(viewModel, container[0])
    }
  }
})
