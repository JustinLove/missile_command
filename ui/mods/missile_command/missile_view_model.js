define(['missile_command/preview', 'missile_command/sanity_check'],
function(preview, sanityCheck) {
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

  wantsToAttack = false
  model.selection.subscribe(function(payload) {
    if (wantsToAttack && model.allowedCommands.Attack) {
      model.setCommandIndex(1)
    }
  })

  return {
    clone: function(id) {
      var missile = Object.create(this)
      missile.id = id
      missile.grouped = ko.observable(false)
      missile.ready = ko.observable(false)
      missile.selected = ko.observable(false)
      missile.target = ko.observable(null)
      missile.found = ko.computed(function() {
        return missile.grouped() || missile.target()
      })
      return missile
    },
    newSelection: function(id) {
      var missile = this.clone(id)
      missile.selected(true)
      missile.captureGroup()
      return missile
    },
    created: function(id, target) {
      var missile = this.clone(id)
      missile.target(target)
      return missile
    },
    captureGroup: function() {
      if (!this.grouped()) {
        this.grouped(true)
        api.select.captureGroup(this.id)
      }
    },
    show: function() {
      var playerHasState = model.mode().match('command_') || !matchingSelection()
      if (this.target()) {
        preview.show(this)
      } else if (this.grouped() && !playerHasState) {
        preview.show(this)
      } else {
        preview.hide()
      }
    },
    hide: function() {
      preview.hide()
    },
    select: function() {
      api.select.recallGroup(this.id)
      sanityCheck.expect(this)
    },
    attack: function() {
      this.select()
      model.setCommandIndex(1)
      wantsToAttack = true
    },
    jump: function() {
      if (this.target()) {
        engine.call('camera.lookAt', JSON.stringify(this.target()));
      } else if (this.grouped()) {
        this.select()
        api.camera.track(true)
        api.camera.setZoom('surface')
      }
    }
  }
})
