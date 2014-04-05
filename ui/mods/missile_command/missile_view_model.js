define(['missile_command/preview'], function(preview) {

  return {
    clone: function(id) {
      var missile = Object.create(this)
      missile.id = id
      return missile
    },
    show: function() {
      preview.show(this)
    },
    hide: function() {
      preview.hide()
    },
    select: function() {
      console.log(this.id)
      api.select.recallGroup(this.id)
      api.camera.track(true)
      api.camera.setZoom('surface')
    }
  }
})
