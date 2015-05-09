define(['missile_command/preview'],
function(preview) {
  return {
    clone: function(id) {
      var missile = Object.create(this)
      missile.id = id
      missile.ready = ko.observable(false)
      missile.selected = ko.observable(false)
      missile.target = ko.observable(null)
      missile.removing = ko.observable(false)
      return missile
    },
    newSelection: function(id) {
      var missile = this.clone(id)
      missile.selected(true)
      return missile
    },
    created: function(id, target) {
      var missile = this.clone(id)
      missile.target(target)
      return missile
    },
    toggle: function() {
      this.ready(!this.ready())
    },
    show: function() {
      if (this.target()) {
        preview.showTarget(this.targetZoom('surface'))
      } else {
        preview.showUnit(this.id)
      }
    },
    hide: function() {
      preview.hide()
    },
    select: function() {
      engine.call("select.byIds", [this.id])
    },
    attack: function() {
      this.select()
      api.Panel.message(api.Panel.parentId, 'missile_command_attack');
    },
    targetZoom: function(zoom) {
      if (this.target()) {
        var target = _.clone(this.target())
        target.zoom = zoom
        return target
      }
    },
    jump: function() {
      if (this.target()) {
        engine.call('camera.lookAt', JSON.stringify(this.targetZoom('air')));
      } else {
        this.select()
        api.camera.track(true)
        api.camera.setZoom('surface')
      }
    },
    jumpPip: function() {
      if (this.target()) {
        var target = this.targetZoom('air')
        target.holodeck = 'pips[0]'
        preview.showTarget(target)
      }
    },
    remove: function() {
      this.removing(!this.removing())
    }
  }
})
