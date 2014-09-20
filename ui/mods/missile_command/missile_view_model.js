define(['missile_command/preview'],
function(preview) {
  var nuke_launcher = '/pa/units/land/nuke_launcher/nuke_launcher.json'

  var matchingSelection = function() {
    /*
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
    */
    return false
  }

  wantsToAttack = false
  /*
  model.selection.subscribe(function(payload) {
    if (wantsToAttack && model.allowedCommands.Attack) {
      model.setCommandIndex(1)
      wantsToAttack = false
    }
  })
  */

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
    show: function() {
      return
      var playerHasState = model.mode().match('command_') || !matchingSelection()
      if (this.target()) {
        preview.show(this)
      } else if (!playerHasState) {
        preview.show(this)
      } else {
        preview.hide()
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
      /*
      if (model.allowedCommands.Attack) {
        model.setCommandIndex(1)
      } else {
        wantsToAttack = true
      }
      */
    },
    jump: function() {
      if (this.target()) {
        engine.call('camera.lookAt', JSON.stringify(this.target()));
      } else {
        this.select()
        api.camera.track(true)
        api.camera.setZoom('surface')
      }
    },
    remove: function() {
      this.removing(!this.removing())
    }
  }
})
