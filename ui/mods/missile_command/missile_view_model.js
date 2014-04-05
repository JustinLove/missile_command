define([], function() {
  return {
    clone: function(id) {
      var missile = Object.create(this)
      missile.id = id
      return missile
    },
    select: function() {
      console.log(this.id)
      api.select.recallGroup(this.id)
      api.camera.track(true)
      api.camera.setZoom('surface')
    }
  }
})
