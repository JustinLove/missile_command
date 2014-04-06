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
    clone: function(id, selected) {
      var missile = Object.create(this)
      missile.id = id
      missile.grouped = ko.observable(true)
      missile.ready = ko.observable(false)
      missile.selected = ko.observable(selected)
      return missile
    },
    created: function(id, target) {
      var missile = this.clone(id, false)
      target.zoom = 'surface'
      missile.target = target
      missile.grouped = ko.observable(false)
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
      if (this.grouped()) {
        api.select.recallGroup(this.id)
        api.camera.track(true)
        api.camera.setZoom('surface')
      } else if (this.target) {
        engine.call('camera.lookAt', JSON.stringify(this.target));
      }
    }
  }
})
