define(['missile_command/preview'], function(preview) {
  var nuke_launcher = '/pa/units/land/nuke_launcher/nuke_launcher.json'

  var matchingSelection = function() {
    var payload = model.selection()
    if (!payload) {
      return true
    }

    var si = payload.spec_ids
    if (Object.keys(si).length == 1) {
      if (si[nuke_launcher] && si[nuke_launcher].length == 1) {
        return true
      }
    }
    return false
  }
  

  return {
    clone: function(id) {
      var missile = Object.create(this)
      missile.id = id
      missile.ready = ko.observable(false)
      missile.selected = ko.observable(true)
      return missile
    },
    show: function() {
      if (!model.mode().match('command_') && matchingSelection()) {
        preview.show(this)
      }
    },
    hide: function() {
      preview.hide()
    },
    select: function() {
      api.select.recallGroup(this.id)
      model.setCommandIndex(1)
    },
    jump: function() {
      api.select.recallGroup(this.id)
      api.camera.track(true)
      api.camera.setZoom('surface')
    }
  }
})
