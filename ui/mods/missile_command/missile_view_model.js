define(['missile_command/preview'], function(preview) {

  return {
    ready: ko.observable(false),
    clone: function(id) {
      var missile = Object.create(this)
      missile.id = id
      return missile
    },
    show: function() {
      if (model.mode() != 'command_attack') {
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
